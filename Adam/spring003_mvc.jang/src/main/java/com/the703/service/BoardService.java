package com.the703.service;

import java.util.List;
import com.the703.dto.BoardDto;

public interface BoardService {
	public List<BoardDto> selectAll();
	public int insert(BoardDto dto);
	public BoardDto detail(int bno);
	public BoardDto editView(int bno);
	public int edit(BoardDto dto);
	public int delete(int bno);
	public int update(BoardDto dto);
	public boolean checkPass(int bno, String bpass);
	
	
	public int updateHit(int bno);
	int delete(BoardDto dto);
}