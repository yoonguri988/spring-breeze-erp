package com.sb.erp.util;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PagingUtil {
	private int listtotal;
	private int onepagelist = 10; 
	private int pagetotal;   
	private int bottomlist;  
	private int pstartno;    

	private int current;    
	private int start;      
	private int end;        
	
	public PagingUtil(int curPage, int totalCount, int pageSizeint ) {
		super();
		this.listtotal = listtotal;
		this.onepagelist = 10;     
		this.pagetotal = listtotal <= 0 ? 1 : (int) Math.ceil(listtotal/(double) onepagelist);
		this.bottomlist = 10;
		this.pstartno = (pstartno-1)*onepagelist;
		this.current = pstartno;
		this.start = ((this.current-1)/this.bottomlist)*this.bottomlist+1;
		this.end = this.start + this.bottomlist-1;
		if(this.end > this.pagetotal) {this.end = this.pagetotal;}
	}
	
	public PagingUtil(int listtotal, int onepagelist, int pstartno) {
		super();
		this.listtotal = listtotal; 
		this.onepagelist = onepagelist;     
		this.pagetotal = listtotal <= 0 ? 1 : (int) Math.ceil(listtotal/(double) onepagelist);
		this.bottomlist = 10;
		this.pstartno = (pstartno-1)*onepagelist;
		this.current = pstartno;
		this.start = ((this.current-1)/this.bottomlist)*this.bottomlist+1;
		this.end = this.start + this.bottomlist-1;
		if(this.end > this.pagetotal) {this.end = this.pagetotal;}
	}

	public Object getStartRow() {
		return null;
	}

	public Object getPageSize() {
		return null;
	}
}
