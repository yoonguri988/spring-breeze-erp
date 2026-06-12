package com.sb.erp.util;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PagingUtil {
	private int listtotal;   //#1) 전체글 256
	private int onepagelist; //#2) 한페이지에 보여줄 게시물의 수 10
	private int pagetotal;   //#3) 총페이지수 256/10=26, 123/10=13
	private int bottomlist;  //#4) 하단의 페이지 나누기-이
	private int pstartno;    //#5) 페이지 시작번호-스타트번호

	private int current;     //#6) 현재페이지번호 15
	private int start;       //#7) 시작    11
	private int end;         //#8) 마지막   20
	
	public PagingUtil(int listtotal, int pstartno) {
		super();
		this.listtotal = listtotal; // 전체 페이지수
		this.onepagelist = 10;      // 한페이지에 보여줄 게시물의 수
		this.pagetotal = listtotal <= 0 ? 1 : (int) Math.ceil(listtotal/(double) onepagelist);
		this.bottomlist = 10;
		this.pstartno = (pstartno-1)*onepagelist;
		this.current = pstartno;
		this.start = ((this.current-1)/this.bottomlist)*this.bottomlist+1;
		this.end = this.start + this.bottomlist-1;
		if(this.end > this.pagetotal) {this.end = this.pagetotal;}
	}
}
