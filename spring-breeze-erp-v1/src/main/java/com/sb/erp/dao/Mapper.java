package com.sb.erp.dao;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME) // 런타임에 인식되도록 설정
@Target(ElementType.TYPE)           // 인터페이스(타입)에 붙일 수 있도록 설정
public @interface Mapper {

}