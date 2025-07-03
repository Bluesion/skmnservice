# 21830423-task-1
2025 하계 SK엠앤서비스 채용연계형 인턴십 ICT 직무 코딩테스트(과제전형) 과제 1

<br>

## 프로젝트 실행 방법
본 프로젝트는 gradle 시스템을 이용합니다. IntelliJ IDEA나 gradle 시스템을 이용하여 프로젝트를 실행해주세요.

#### 옵션 1: IDE 사용 (추천)

*   **준비사항:** IntelliJ IDEA(2025.1.3)가 설치되어 있어야 합니다.
*   **IDE 실행**
    - 프로젝트를 IDE에서 엽니다.
    - src/main/kotlin 폴더에 있는 메인 함수 (main 함수가 있는 파일)를 엽니다.
    - 메인 함수 옆에 있는 녹색 실행 버튼 (▶)을 클릭하거나, Shift + F10 (또는 macOS의 경우 Control + R)을 눌러 프로그램을 실행합니다.

<br>

#### 옵션 2: Gradle 사용

*   **준비사항:** Gradle을 설치해주세요.
    *   **Windows:**
        본 프로젝트의 루트 디렉토리에서 다음 명령어를 실행하세요:
        ```bash
        gradlew.bat run
        ```

    *   **Mac/Linux:**
        본 프로젝트의 루트 디렉토리에서 다음 명령어를 실행하세요:
        ```bash
        ./gradlew run
        ```

<br>

## 구현 사항
- CSV parser: GPS 데이터가 담겨 있는 CSV를 파싱합니다.
- OSM parser: 도로 데이터가 담겨 있는 OSM을 파싱합니다.
- Harversine Calculator: 두 좌표 사이의 거리를 계산합니다.
- Logger: 더 편한 로깅을 위한 클래스입니다.
