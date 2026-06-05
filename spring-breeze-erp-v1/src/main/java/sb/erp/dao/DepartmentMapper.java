package sb.erp.dao;

@ErpMapper
public interface DepartmentMapper {

	int countActiveDepts(int companyId);

}
