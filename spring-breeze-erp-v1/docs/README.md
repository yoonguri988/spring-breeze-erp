# sql 구문 작성

## 테이블

### 회사 Company

```sql
+-----------+--------------+------+-----+-------------------+-------------------+
| Field     | Type         | Null | Key | Default           | Extra             |
+-----------+--------------+------+-----+-------------------+-------------------+
| companyId | int          | NO   | PRI | NULL              | auto_increment    | -- 회사id
| companyNm | varchar(100) | NO   |     | NULL              |                   | -- 회사명
| bizNo     | varchar(20)  | YES  | UNI | NULL              |                   | -- 사업자번호
| tel       | varchar(20)  | YES  |     | NULL              |                   | -- 전화번호
| address   | varchar(255) | YES  |     | NULL              |                   | -- 주소
| logoUrl   | varchar(500) | YES  |     | NULL              |                   | -- 로고 url
| createdAt | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED | -- 등록일시
| updatedAt | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED | -- 수정일시
+-----------+--------------+------+-----+-------------------+-------------------+
```

### 부서 department

```sql
+-----------+--------------+------+-----+-------------------+-------------------+
| Field     | Type         | Null | Key | Default           | Extra             |
+-----------+--------------+------+-----+-------------------+-------------------+
| deptId    | int          | NO   | PRI | NULL              | auto_increment    | -- 부서 id
| companyId | int          | NO   |     | NULL              |                   | -- 회사 id
| parentId  | int          | YES  |     | NULL              |                   | -- 부서장 id
| deptNm    | varchar(100) | NO   |     | NULL              |                   | -- 부서명
| deptCd    | varchar(30)  | YES  |     | NULL              |                   | -- 부서코드
| depth     | int          | YES  |     | 0                 |                   | -- 깊이
| sortOrder | int          | YES  |     | 0                 |                   | -- 정렬순서
| managerId | int          | YES  |     | NULL              |                   | -- 관리자 id
| createdAt | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED | -- 생성일시
| updatedAt | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED | -- 수정일시
+-----------+--------------+------+-----+-------------------+-------------------+
```

## 공통

---

## 관리자

### 회사 Company

1.  회사 목록 조회 및 (회사명 또는 사업자번호)로 검색, 페이징 추가

    ```sql
    select * from company
    where (companyNm like concat('%',#{keyword},'%')
    or bizNo like concat('%',#{keyword},'%'))
    order by companyId desc
    limit #{pstarValue}, #{onepagelist};
    ```

    <br/>

1.  companyId를 통한 회사 조회

    ```sql
    select * from company
    where companyId = #{companyId};
    ```

    <br/>

1.  사업자번호(bizNo)를 통한 회사 조회

    ```sql
    select * from company
    where bizNo = #{bizNo};
    ```

    <br/>

1.  (회사명 또는 사업자번호)로 상위 5개 회사id, 회사명, 사업번호 조회

    ```sql
    select companyId, companyNm, bizNo
    from company
    where (companyNm like concat('%', #{keyword}, '%') or bizNo like concat('%',#{keyword},'%'))
    order by companyNm asc
    limit 5;
    ```

    <br/>

1.  회사 등록

    ```sql
    insert into company (companyNm, bizNo, tel, address, logoUrl)
    values (#{companyNm}, #{bizNo}, #{tel}, #{address}, #{logoUrl});
    ```

    <br/>

1.  회사 수정

    ```sql
    update company
    set companyNm = #{companyNm}
    ,tel = #{tel}
    ,address = #{address}
    ,logoUrl = #{logoUrl}
    where companyId = #{companyId};
    ```

1.  회사 삭제

    ```sql
    delete from company
    where companyId = #{companyId};
    ```
