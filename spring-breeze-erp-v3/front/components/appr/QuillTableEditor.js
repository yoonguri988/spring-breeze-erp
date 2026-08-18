import { forwardRef, useImperativeHandle, useRef } from "react";
import ReactQuill, { Quill} from "react-quill";
import QuillBetterTable from "quill-better-table";
import "react-quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";

// 모듈 등록은 이 파일이 클라이언트에서 처음으로 로드될 때 1회만 실행
Quill.register({ "modules/better-table": QuillBetterTable}, true);

const modules = {
    table: false, // Quill 기본 table 모듈과 충돌 방지
    "better-table": {
        operationMenu: {
            items: {
                unmergeCells: {text: "셀 병합 해제"},
            },
        },
    },
    keyboard: {
        bindings: QuillBetterTable.keyboardBindings,
    },
};

// forwardRef로 감싸서 외부(FormWritePage)에서 표 삽입 버튼을 직접 붙일 수 있게
const QuillTableEditor = forwardRef(function QuillTableEditor({ value, onChange}, ref) {
    const quillRef = useRef(null);

    useImperativeHandle(ref, () => ({
        insertTable: (rows = 3, cols = 3) => {
            const editor = quillRef.current?.getEditor();
            const tableModule = editor?.getModule("better-table");
            tableModule?.insertTable(rows, cols);
        },
    }));

    return (
        <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
        />
    );
});

export default QuillTableEditor;