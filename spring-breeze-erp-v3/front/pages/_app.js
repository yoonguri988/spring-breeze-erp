//pages/_app.js #전체 앱의 공통 설정(Redux Provider, 글로벌 스타일 등)
//import, require
import React from 'react';
import { wrapper } from '../store/configureStore'; //전역 상태 + 서버 연동
import AppLayout from '../components/AppLayout';   //공통 레이아웃
import 'antd/dist/antd.css';
import '../styles/global.css';

//부품
function MyApp({ Component, pageProps }) {  //부품, 초기 설정값
    return (
        <>
            <Component {...pageProps} />
        </>
    );
}

//export
export default wrapper.withRedux(MyApp); // 스토어 전역사용