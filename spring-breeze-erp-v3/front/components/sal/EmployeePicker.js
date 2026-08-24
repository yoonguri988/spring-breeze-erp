// components/sal/EmployeePicker.js
// 급여 화면(급여기준/급여지급 등록, 계좌 조회)에서 공통으로 쓰는 사원 검색 Select.
// 사원 목록은 emp 모듈(기존 empReducer/empSaga, GET /api/emp)을 그대로 재사용한다.
// emp API는 페이지당 10건 고정이라, 이름을 입력할 때마다(디바운스) 재조회해서 옵션을 채운다.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Spin } from "antd";
import { listEmpRequest } from "../../reducers/emp/empReducer";

export default function EmployeePicker({
  value,
  onChange,
  placeholder = "사원 이름으로 검색",
  style,
  disabled,
}) {
  const dispatch = useDispatch();
  const { empList, loading } = useSelector((state) => state.emp);
  const timerRef = useRef(null);

  useEffect(() => {
    // 최초 진입 시 기본 목록(최근순 상위 10건) 로드
    dispatch(listEmpRequest({ page: 1 }));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSearch = (keyword) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(listEmpRequest({ keyword, page: 1 }));
    }, 300);
  };

  const options = useMemo(
    () =>
      (empList || []).map((e) => ({
        value: e.empId,
        label: `${e.empName} · ${e.deptName || "-"} · ${e.posName || "-"} (${e.empNo})`,
      })),
    [empList],
  );

  return (
    <Select
      showSearch
      allowClear
      value={value ?? undefined}
      onChange={onChange}
      onSearch={handleSearch}
      placeholder={placeholder}
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : "검색 결과가 없습니다"}
      style={style || { width: "100%" }}
      disabled={disabled}
      options={options}
    />
  );
}
