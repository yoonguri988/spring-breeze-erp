package sb.erp.utils;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class PagingUtil {
	private int listtotal; // 전체 수
	private int onepagelist = 10; // 한페이지에 나타낼 갯수
	private int pagetotal; // 총 페이지 수
	private int bottomlist = 10; // 하단 페이지 갯수
	private int pstartno = 1; //페이지의 시작 번호
	
	private int current;
	private int start;
	private int end;
	
	// 전체 갯수, 한페이지에 보일 갯수, 페이지 시작번호
	public PagingUtil(int listtotal, int onepagelist, int pstartno) {
		super();
		this.listtotal = listtotal;
		this.onepagelist = onepagelist;
		this.pagetotal = listtotal <= 0 ? 1: (int) Math.ceil(listtotal/(double) onepagelist);
		this.pstartno = (pstartno-1) * onepagelist;
		this.current = pstartno;
		this.start = ((this.current-1)/this.bottomlist)*this.bottomlist+1;
		this.end = this.start + this.bottomlist-1;
		if(this.end > this.pagetotal) {this.end = this.pagetotal;}
	}
	
}
