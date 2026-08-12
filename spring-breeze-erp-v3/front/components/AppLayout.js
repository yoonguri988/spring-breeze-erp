// components/AppLayout.js      # 재사용 가능한 UI 컴포넌트 폴더
// 1. require
import { Layout, Menu, Input, Row, Col, Drawer, Button, Grid } from "antd";  
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";

import { useSelector, useDispatch } from 'react-redux'; // 전역상태, 액션
import { useRouter }                from 'next/router'; // 이동
import { useEffect, useState }      from 'react';       // 이벤트 변경 감지, 변수
import Link                         from 'next/link';   // 

const { Header, Footer, Content } = Layout;
const { useBreakpoint } = Grid;


// 2. 부품
function AppLayout( { children, initialUser } ){

    // 변수, 세팅함수
    const router = useRouter();
    const dispatch = useDispatch();

    return (
        <Layout>
            {/* Header */}
            <Header>
                Header
            </Header>
    
            <Layout>
                <Content> {children} </Content>
            </Layout>

            <Footer>
                Footer
            </Footer>
        </Layout>
    );
}

// 3. export
export default AppLayout;