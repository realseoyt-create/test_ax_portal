# Windows local dev now, portable to Linux+Docker later

지금은 윈도우 로컬 환경에서 먼저 띄우지만, 최종 배포 대상은 Docker를 지원하는 리눅스 서버다. 이 전환이 코드 변경 없이 가능하도록 파일 경로·포트·환경설정은 전부 환경 변수로 다루고, OS 종속적인 코드(윈도우 전용 경로 구분자, 윈도우 전용 API 등)는 쓰지 않는다.
