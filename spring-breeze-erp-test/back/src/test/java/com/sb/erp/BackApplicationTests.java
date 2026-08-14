package com.sb.erp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

@SpringBootTest
class BackApplicationTests {

    @Autowired
    ApplicationContext ctx;

    @Test
    void printBeans() {
        System.out.println("=== DataSource beans ===");
        System.out.println(java.util.Arrays.toString(
            ctx.getBeanNamesForType(javax.sql.DataSource.class)));

        System.out.println("=== SqlSessionFactory beans ===");
        System.out.println(java.util.Arrays.toString(
            ctx.getBeanNamesForType(org.apache.ibatis.session.SqlSessionFactory.class)));
    }
}
