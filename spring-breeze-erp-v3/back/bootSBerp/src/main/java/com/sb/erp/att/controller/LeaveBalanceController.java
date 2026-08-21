package com.sb.erp.att.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lev")
@RequiredArgsConstructor
@Tag(name = "연차 관리", description = "잔여 연차 조회 및 수정")
public class LeaveBalanceController {

}
