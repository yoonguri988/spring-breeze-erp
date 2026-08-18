// pages/notice/write.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button, Input, Upload, Form, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createNoticeRequest,resetNoticeState } from "../../reducers/notice/noticeReducer";

export default function NoticeWritePage(){
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state)=>state.notice);

  const [fileList, setFileList] = useState([]);

    useEffect(() => {
        dispatch(resetNoticeState());
    }, [dispatch]);

    useEffect(()=>{
    if(success){
      message.success("공지사항이 성공적으로 등록되었습니다.");
      setFileList([]);
      dispatch(resetNoticeState());
      router.push("/notice/list");
    }
    },[success,router,dispatch]);

  const onFinish =(values)=>{
    const dto = {
        btitle:values.btitle,
        bcontent:values.bcontent
    };
    const file= fileList.length > 0
        ? fileList[0].originFileObj
        : null;

    dispatch(createNoticeRequest({dto,file}));
    };

    // 파일 선택 변경
    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };
    return (
      <main className="sb-content">
        <div className="sb-page-head">
          <div className="sb-page-head__txt">
             <div className="sb-breadcrumb">
              <Link href="/">홈</Link> 
              <i className="bi bi-chevron-right"></i>
              업무 
              <i className="bi bi-chevron-right"></i>
              <Link href="/notice/list">공지 관리</Link> 
              <i className="bi bi-chevron-right"></i>
              공지 작성
              </div>
                <h1>공지 작성</h1>
                <p>새로운 공지사항을 등록합니다.</p>
               </div>
            </div>
                 <div className="sb-card mb-3">
                  <div className="sb-card__body">
                    <form id="noticeWriteForm" onSubmit={(e) => { e.preventDefault(); }} >
                        <div className="row g-3">
                            <div className="col-12">
                                <label htmlFor="btitle" className="sb-form-label" > 제목 </label>
                                <Input
                                    id="btitle"
                                    name="btitle"
                                    className="form-control"
                                    placeholder="공지 제목을 입력하세요"
                                />
                            </div>
                            <div className="col-12">
                                <label htmlFor="bcontent" className="sb-form-label" > 내용 </label>
                                <Input.TextArea
                                    id="bcontent"
                                    name="bcontent"
                                    className="form-control"
                                    rows={8}
                                    placeholder="공지 내용을 입력하세요"
                                />
                            </div>
                            <div className="col-12">
                                <label htmlFor="file" className="sb-form-label" > 파일 첨부 </label>
                                <Upload
                                    beforeUpload={() => false}
                                    fileList={fileList}
                                    onChange={handleChange}
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>
                                        파일 선택
                                    </Button>
                                </Upload>
                                <div className="form-text"> 이미지 · pdf · office 문서 · hwp · zip, 최대 10MB (선택사항) </div>
                            </div>
                        </div>
                        <div className="sb-form-actions mt-4 mb-4 pe-2 text-end">
                              <Button
        type="default"
        className="btn btn-ghost"
        onClick={() => router.push("/notice/list")}
    >
        취소
    </Button>
    <Button
        type="default"
        className="btn btn-sb-soft"
        onClick={() => router.push("/notice/list")}
    >
        목록
    </Button>
    <Button
        type="default"
        className="btn btn-sb"
        htmlType="button"
        loading={loading}
        onClick={() => {
            const btitle = document.getElementById("btitle").value;
            const bcontent = document.getElementById("bcontent").value;

            if (!btitle.trim()) {
                message.warning("제목을 입력해주세요.");
                return;
            }

            if (!bcontent.trim()) {
                message.warning("내용을 입력해주세요.");
                return;
            }

            onFinish({ btitle, bcontent });
        }}
    >
        <i className="bi bi-megaphone"></i>
        게시
    </Button>
                        </div>
                    </form>
                    {error && ( <p style={{ color: "red" }}> {error} </p> )}
                </div>
            </div>
        </main>
    );
}