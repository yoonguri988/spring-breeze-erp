package com.sb.erp.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.sb.erp.exception.FileUploadException;

/**
 * 파일 업로드 공통 유틸. (정적 메서드만 제공, 인스턴스화 불필요)
 *
 * 사용법:
 *   FileUploadDto result = FileUploadUtil.upload(multipartFile, FileUploadType.COMPANY_LOGO);
 *   company.setComLogoUrl(result.getFileUrl());   // DB 저장용 URL
 *
 * 저장 위치(baseDir)는 기본값으로 servlet-context.xml 의 /upload/** 매핑 경로(C:/file/)와 동일하게 맞춰뒀다.
 * 운영/개발 환경마다 경로가 다르면 classpath:config/upload.properties 파일을 만들어 아래 키로 덮어쓸 수 있다.
 *
 *   upload.baseDir=C:/file/
 *   upload.urlPrefix=/upload/
 */
public class FileUploadUtil {

    private static String baseDir = "C:/file/";
    private static String urlPrefix = "/upload/";

    static {
        try (InputStream is = FileUploadUtil.class.getClassLoader()
                .getResourceAsStream("config/upload.properties")) {
            if (is != null) {
                Properties props = new Properties();
                props.load(is);
                baseDir = props.getProperty("upload.baseDir", baseDir);
                urlPrefix = props.getProperty("upload.urlPrefix", urlPrefix);
            }
        } catch (IOException e) {
            // config/upload.properties 가 없으면 기본값(servlet-context.xml과 동일 경로) 사용
        }
        if (!baseDir.endsWith("/")) baseDir += "/";
        if (!urlPrefix.endsWith("/")) urlPrefix += "/";
    }

    private FileUploadUtil() {
    }

    /** 검증 + 저장을 한 번에 처리. 보통 컨트롤러에서 이 메서드만 호출하면 됨 */
    public static FileUploadDto upload(MultipartFile file, FileUploadType type) {
        validate(file, type);
        return store(file, type);
    }

    /** 확장자 / Content-Type / 용량 / 매직바이트 검증. 실패 시 FileUploadException 발생 */
    public static void validate(MultipartFile file, FileUploadType type) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("업로드할 파일이 없습니다.");
        }
        if (file.getSize() > type.getMaxSize()) {
            throw new FileUploadException(String.format(
                "파일 용량은 최대 %dMB까지 업로드 가능합니다.", type.getMaxSize() / (1024 * 1024)));
        }

        String originalName = getOriginalFileName(file);
        String ext = getExtension(originalName);
        if (ext.isEmpty() || !type.getAllowedExtensions().contains(ext)) {
            throw new FileUploadException("허용되지 않는 파일 형식입니다. (허용 확장자: "
                + String.join(", ", type.getAllowedExtensions()) + ")");
        }

        String contentType = file.getContentType();
        if (contentType == null || !type.getAllowedMimeTypes().contains(contentType.toLowerCase())) {
            // 브라우저/OS에 따라 svg, webp 의 Content-Type이 다르게 잡히는 경우가 있어
            // 실제 테스트에서 너무 자주 막히면 이 블록을 경고 로그로만 바꾸고 확장자 검증에 맡겨도 된다.
            throw new FileUploadException("허용되지 않는 파일 형식입니다. (Content-Type 불일치: " + contentType + ")");
        }

        // png/jpg/webp는 매직바이트(파일 헤더)로 한번 더 확인해 확장자 위장을 막는다.
        // svg는 텍스트(XML) 기반이라 매직바이트 검사 대상에서 제외.
        if (!ext.equals("svg")) {
            try {
                byte[] header = readHeader(file, 12);
                if (!isValidImageSignature(header, ext)) {
                    throw new FileUploadException("파일 내용이 손상되었거나 확장자를 위장한 파일입니다.");
                }
            } catch (IOException e) {
                throw new FileUploadException("파일을 읽는 중 오류가 발생했습니다.", e);
            }
        }
    }

    /** 검증이 끝난 파일을 디스크에 저장하고 결과를 반환 (validate를 먼저 호출했다는 전제) */
    public static FileUploadDto store(MultipartFile file, FileUploadType type) {
        String originalName = getOriginalFileName(file);
        String ext = getExtension(originalName);
        String savedName = UUID.randomUUID().toString().replace("-", "") + "." + ext;

        Path dir = Paths.get(baseDir, type.getSubDir());
        try {
            Files.createDirectories(dir);
            Path target = dir.resolve(savedName);
            file.transferTo(target.toFile());

            String fileUrl = urlPrefix + type.getSubDir() + "/" + savedName;
            return new FileUploadDto(originalName, savedName, target.toString(), fileUrl, file.getSize());
        } catch (IOException e) {
            throw new FileUploadException("파일 저장 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /** 로고 교체 등으로 기존 파일을 지울 때 사용. savedPath는 FileUploadDto.getSavedPath() 값 */
    public static boolean delete(String savedPath) {
        if (savedPath == null || savedPath.isEmpty()) {
            return false;
        }
        File f = new File(savedPath);
        return f.exists() && f.delete();
    }

    // ===================== 내부 헬퍼 =====================

    private static String getOriginalFileName(MultipartFile file) {
        String name = file.getOriginalFilename();
        if (name == null) {
            return "";
        }
        // 구형 브라우저가 풀 경로를 같이 보내는 경우 대비, 파일명만 추출 (경로 조작 방지 겸용)
        name = name.replace("\\", "/");
        return name.substring(name.lastIndexOf("/") + 1);
    }

    private static String getExtension(String fileName) {
        int dot = fileName.lastIndexOf(".");
        if (dot < 0 || dot == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(dot + 1).toLowerCase();
    }

    private static byte[] readHeader(MultipartFile file, int size) throws IOException {
        byte[] header = new byte[size];
        try (InputStream is = file.getInputStream()) {
            int read = is.read(header, 0, size);
            if (read < size) {
                byte[] trimmed = new byte[Math.max(read, 0)];
                System.arraycopy(header, 0, trimmed, 0, trimmed.length);
                return trimmed;
            }
        }
        return header;
    }

    private static boolean isValidImageSignature(byte[] header, String ext) {
        if (header == null) {
            return false;
        }
        switch (ext) {
            case "png":
                return header.length >= 4
                    && (header[0] & 0xFF) == 0x89 && header[1] == 0x50
                    && header[2] == 0x4E && header[3] == 0x47;
            case "jpg":
            case "jpeg":
                return header.length >= 3
                    && (header[0] & 0xFF) == 0xFF
                    && (header[1] & 0xFF) == 0xD8
                    && (header[2] & 0xFF) == 0xFF;
            case "webp":
                return header.length >= 12
                    && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
                    && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P';
            default:
                return false;
        }
    }
}