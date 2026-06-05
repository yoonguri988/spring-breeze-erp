package com.the703.service;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.the703.dao.BoardMapper;
import com.the703.dto.BoardDto;

@Service
public class BoardServiceImpl implements BoardService {

	@Autowired
	BoardMapper dao;

	@Override
	public List<BoardDto> selectAll() {
		return dao.selectAll();
	}

	@Override
	public int insert(BoardDto dto) {
		try {
			dto.setBip(InetAddress.getLocalHost().getHostAddress());
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		return dao.insert(dto);
	}

	@Override
	public BoardDto detail(int bno) {
		return dao.select(bno);
	}

	@Override
	public BoardDto editView(int bno) {
		return dao.select(bno);
	}

	@Override
	public int edit(BoardDto dto) {
		return dao.update(dto);
	}

	@Override
	public int update(BoardDto dto) {
		return dao.update(dto);
	}

	@Override
	public int delete(BoardDto dto) {
		return dao.delete(dto.getBno());
	}

	@Override
	public int delete(int bno) {
		return dao.delete(bno);
	}

	@Override
	public boolean checkPass(int bno, String bpass) {
		BoardDto dto = this.detail(bno);
		if (dto != null && dto.getBpass() != null) {
			return dto.getBpass().equals(bpass);
		}
		return false;
	}

	// ★ 조회수 증가 기능이 실제로 작동하도록 Mapper 연결
	@Override
	public int updateHit(int bno) {
		return dao.updateHit(bno);
	}
}