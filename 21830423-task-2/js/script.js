/**
 * 지정된 파일 경로에서 CSV 데이터를 로드하고 파싱합니다.
 * 
 * 추가 요건 3에 충족하도록 로컬에서 CSV 파일을 불러옵니다.
 * 추가 요건 1에 충족하도록 인물 상세 정보를 이름과 성 기준으로 정렬하여 각 행을 객체로 나타내는 배열을 반환합니다.
 * 
 * @param {string} filePath - 불러올 CSV 파일의 경로
 * @returns {Promise<Object[]>} 각 행을 매핑된 속성명으로 나타내는 객체 배열을 반환하는 프로미스
 * @throws {Error} CSV 파일을 가져오거나 파싱할 수 없는 경우 에러를 발생시킵니다.
 */
function loadCsvData(filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                // 에러 처리
                // 지금은 로컬에서 CSV 파일을 불러오기 때문에 파일 경로가 잘못되지 않았는지 꼭 확인해주세요.
                console.error(`CSV 파일 불러오기 실패: ${response.status} ${response.statusText}`);
                throw new Error(`${filePath} 불러오기 실패`);
            }
            return response.text();
        })
        .then(csvText => {
            const data = [];
            const lines = csvText.trim().split('\n');

            if (lines.length < 2) {
                console.warn("CSV 파일이 비어있거나 헤더만 포함되어 있습니다. 파일을 확인해주세요.");
                return [];
            }

            // CSV 데이터를 읽고, Object로 변환합니다.
            const rawHeaders = parseCSVLine(lines[0]); // CSV 헤더를 파싱합니다.
            const headerMap = {
                'Index': 'index',
                'User Id': 'userId',
                'First Name': 'firstName',
                'Last Name': 'lastName',
                'Sex': 'sex',
                'Email': 'email',
                'Phone': 'phone',
                'Date of birth': 'birthday',
                'Job Title': 'jobTitle'
            };

            // Create the actual headers array that the JS code will use
            const jsHeaders = rawHeaders.map(rawHeader => headerMap[rawHeader] || rawHeader.toLowerCase().replace(/\s+/g, '')); // Fallback for unmapped headers

            // 한 줄씩 읽어 각 행을 객체로 변환합니다.
            // 객체에는 index, userId, firstName, lastName, sex, email, phone, birthday, jobTitle 속성이 존재합니다.
            for (let i = 1; i < lines.length; i++) {
                const values = parseCSVLine(lines[i]);
                if (values.length === rawHeaders.length) {
                    const rowObject = {};
                    jsHeaders.forEach((jsHeader, index) => {
                        rowObject[jsHeader] = values[index];
                    });
                    data.push(rowObject);
                } else {
                    console.warn(`CSV 파일 ${i + 1}번째 줄에 문제가 있습니다.`);
                }
            }

            // 이름(firstName)과 성(lastName)에 따라 데이터를 정렬합니다.
            data.sort((a, b) => {
                // 누락된 이름 데이터가 있다면 공백으로 처리합니다.
                const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
                const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });

            return data;
        })
        .catch(error => {
            console.error("CSV 파일 처리 중 오류가 발생하였습니다: ", error);
            throw error;
        });
}

/**
 * CSV 한 줄을 파싱하여 각 필드의 배열로 반환합니다.
 * 따옴표로 감싸진 필드와 이스케이프된 따옴표("")를 올바르게 처리합니다.
 *
 * @param {string} line - 파싱할 CSV 한 줄
 * @returns {string[]} 파싱된 각 필드의 문자열 배열
 */
function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
        const char = line[i];

        if (char === '"') {
            // 이스케이프 따옴표 체크
            if (inQuotes && line[i + 1] === '"') {
                currentValue += '"';
                i++; // 다음 따옴표 처리를 건너뜁니다.
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // 따옴표 밖의 쉼표는 필드의 끝
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
        i++;
    }

    values.push(currentValue.trim());

    return values;
}

/**
 * 유저가 입력한 검색어에 대해 매칭되는 이름을 가진 객체 배열을 반환하는 함수입니다.
 * 
 * findMatchingNames로 함수 이름을 변경하여 가독성을 높였습니다.
 * 
 * @param {Object[]} people - 검색을 수행할 객체 배열
 * @param {string} query - 유저가 입력한 검색어
 * @returns {Object[]} 검색어와 매칭된 이름 배열
 */
function filterPeople(people, query) {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();

    return people.filter(person => {
        const firstName = person.firstName ? person.firstName.toLowerCase() : '';
        const lastName = person.lastName ? person.lastName.toLowerCase() : '';

        // 성이나 이름 둘 중 하나만 입력해도 검색이 가능하도록 합니다.
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName.includes(lowerQuery);
    });
}

/**
 * 유저가 입력한 검색어로 시작하는 이름을 사진 객체를 반환하는 함수입니다.
 * 
 * @param {Object[]} people - 검색을 수행할 객체 배열
 * @param {string} query - 유저가 입력한 검색어
 * @returns {Object|null} 검색어와 매칭된 이름을 가진 객체
 */
function getAutocompleteSuggestion(people, query) {
    if (!query.trim()) return null;
    const lowerQuery = query.toLowerCase();

    // 첫 번째로 매칭되는 사람을 찾습니다.
    let match = people.find(person => {
        const firstName = person.firstName ? person.firstName.toLowerCase() : '';
        return firstName.startsWith(lowerQuery);
    });

    // 유저가 입력한 검색어로 시작하는 firstName이 없다면 lastName을 살펴봅니다.
    if (!match) {
        match = people.find(person => {
            const lastName = person.lastName ? person.lastName.toLowerCase() : '';
            return lastName.startsWith(lowerQuery);
        });
    }

    return match || null;
}

/**
 * 유저가 입력한 검색어에 대해 검색 결과 리스트를 처리하는 함수입니다.
 * 
 * @param {HTMLElement} listElement - UI가 갱신되는 태그
 * @param {Object[]} people - 사용자가 입력한 검색어와 매칭되는 이름을 가진 객체 배열
 * @param {string} query - 사용자가 입력한 검색어
 */
function updateResultsList(listElement, people, query) {
    listElement.innerHTML = ''; // 기존 힌트를 초기화합니다.

    if (people.length === 0) {
        const message = query.trim() ? '검색 결과가 없습니다' : '검색어를 입력해주세요';
        listElement.innerHTML = `<li class="no-results">${message}</li>`;
        return;
    }

    people.forEach(person => {
        const li = document.createElement('li');
        // Safely construct the display name
        const displayName = `${person.firstName || ''} ${person.lastName || ''}`.trim();
        li.textContent = displayName;

        // 클릭 이벤트를 위해 데이터를 설정합니다.
        li.dataset.userId = person.userId;
        li.dataset.firstName = person.firstName;
        li.dataset.lastName = person.lastName;
        listElement.appendChild(li);
    });
}

/**
 * 자동완성 힌트를 처리하는 함수입니다.
 * 
 * 예를 들어 유저가 Al을 입력 시, __exander 텍스트 오버레이를 덧씌워 자동완성 힌트를 제공합니다.
 * 
 * @param {HTMLElement} overlayElement - 자동완성 오버레이 태그
 * @param {Object|null} person - 자동완성 힌트를 제공할 객체입니다.
 * @param {string} query - 전체 힌트 중 유저가 입력한 부분
 */
function updateAutocompleteOverlay(overlayElement, person, query) {
    overlayElement.innerHTML = ''; // 기존 힌트를 초기화합니다.

    if (person && query.length > 0) {
        const lowerQuery = query.toLowerCase();
        let fullSuggestion = null;

        // 성이나 이름이 존재하지 않으면 공백으로 처리합니다.
        const firstName = person.firstName ? person.firstName.toLowerCase() : '';

        // 유저가 입력한 검색어가 firstName으로 시작하는 경우에만 자동완성 힌트를 제공합니다.
        if (firstName.startsWith(lowerQuery)) {
            fullSuggestion = `${person.firstName || ''} ${person.lastName || ''}`.trim();
        }

        if (fullSuggestion) {
            // 유저가 입력한 텍스트와 동일한 길이의 텍스트를 투명하게 만들어 자동완성 힌트의 공백을 조정합니다.
            const typedPart = document.createElement('span');
            typedPart.style.color = 'transparent';
            typedPart.textContent = query;

            // 나머지 자동완성 힌트를 제공합니다.
            const hintPart = document.createElement('span');
            hintPart.className = 'autocomplete-hint';
            hintPart.textContent = fullSuggestion.slice(query.length);

            overlayElement.appendChild(typedPart);
            overlayElement.appendChild(hintPart);
        }
    }
}

/**
 * 유저가 선택한 사람의 상세 정보를 모달에 표시합니다.
 * 이름, 성, 성별, 이메일, 전화번호, 생년월일, 직책 정보를 표시합니다.
 *
 * @param {Object} person - 상세 정보를 표시할 사람 객체입니다.
 */
function showPersonDetailModal(person) {
    const modal = document.getElementById('personDetailModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');

    // 데이터가 누락된 경우는 N/A로 표기합니다.
    const firstName = person.firstName || 'N/A';
    const lastName = person.lastName || 'N/A';
    const sex = person.sex || 'N/A';
    const email = person.email || 'N/A';
    const phone = person.phone || 'N/A';
    const birthday = person.birthday || 'N/A';
    const jobTitle = person.jobTitle || 'N/A';

    modalTitle.textContent = `${firstName} ${lastName}`;
    modalBody.innerHTML = `
        <p><strong>이름:</strong> ${firstName} ${lastName}</p>
        <p><strong>성별:</strong> ${sex}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>전화번호:</strong> ${phone}</p>
        <p><strong>생년월일:</strong> ${birthday}</p>
        <p><strong>직책:</strong> ${jobTitle}</p>
    `;
    modal.style.display = "block";
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsList = document.getElementById('resultsList');
    const autocompleteOverlay = document.getElementById('autocompleteOverlay');
    const modal = document.getElementById('personDetailModal');
    const closeButton = modal.querySelector('.close-button');

    let allPeople = []; // 전체 인물 데이터를 저장하는 배열

    // CSV 데이터를 불러옵니다.
    loadCsvData('./assets/people-100.csv')
        .then(peopleData => {
            allPeople = peopleData;
            if (allPeople.length === 0) {
                console.error("이름 데이터를 불러오지 못했습니다. 파일 자체에 문제가 있지 않은지, 파일 경로에 문제가 있지 않은지 확인해주세요.");
                resultsList.innerHTML = '<li class="no-results">데이터를 불러오지 못했습니다.</li>';
                searchInput.disabled = true; // 데이터 로딩 중 오류 발생시 검색창 비활성화
                return;
            }
            
            updateResultsList(resultsList, [], '');

            console.log('애플리케이션이 초기화되었습니다.');
            console.log(`총 ${allPeople.length}개의 이름이 로드되었습니다.`);
        })
        .catch(error => {
            console.error("CSV 데이터 로딩 중 오류 발생:", error);
            resultsList.innerHTML = '<li class="no-results">데이터 로딩 중 오류가 발생했습니다. CSV 파일과 경로를 다시 한 번 확인해주시고, CORS 오류가 발생한 경우 live-server를 통해 실행해주세요.</li>';
            searchInput.disabled = true; // 데이터 로딩 중 오류 발생시 검색창 비활성화
        });

    // 검색창 입력 이벤트 리스너
    // 사용자가 입력한 검색어를 토대로 결과 리스트와 자동완성 오버레이를 업데이트합니다.
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        const matchingPeople = filterPeople(allPeople, query);
        const suggestion = getAutocompleteSuggestion(allPeople, query);

        updateResultsList(resultsList, matchingPeople, query);
        updateAutocompleteOverlay(autocompleteOverlay, suggestion, query);
    });

    // 결과 목록 클릭 이벤트 리스너
    // userId를 이용하여 클릭된 항목의 상세 정보를 모달로 표시합니다.
    resultsList.addEventListener('click', (event) => {
        const clickedItem = event.target;
        if (clickedItem.tagName === 'LI' && !clickedItem.classList.contains('no-results')) {
            const userId = clickedItem.dataset.userId;
            
            const person = allPeople.find(p => p.userId === userId);
            if (person) {
                showPersonDetailModal(person);
            } else {
                console.error(`userId가 ${userId}인 해당하는 데이터를 찾을 수 없습니다.`);
            }
        }
    });

    // 모달창 닫기 버튼 리스너
    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // 모달창 바깥 리스너
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});