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
 * @param {Object|null} person - 자동완성 힌트를 제공할 객체
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
 * @param {Object} person - 상세 정보를 표시할 사람 객체
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

/**
 * 주어진 함수의 실행을 지연시켜, 마지막 호출 후 지정된 시간(wait)만큼 대기한 뒤에만 실행합니다.
 * 주로 입력 이벤트와 같이 빠르게 반복되는 이벤트에서 함수 호출 빈도를 줄이기 위해 사용됩니다.
 *
 * @param {Function} func - 지연 실행할 함수
 * @param {number} wait - 함수가 호출된 후 실행까지 대기할 시간(ms)
 * @returns {Function} 지연 실행되는 새로운 함수
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsList = document.getElementById('resultsList');
    const autocompleteOverlay = document.getElementById('autocompleteOverlay');
    const modal = document.getElementById('personDetailModal');
    const closeButton = modal.querySelector('.close-button');

    let allPeople = []; // 전체 인물 데이터를 저장하는 배열

    // Web Worker 설정
    const worker = new Worker('./js/worker.js');

    // Worker로부터 메시지를 받았을 때 처리
    worker.onmessage = function(event) {
        const { type, data, message } = event.data;

        if (type === 'dataLoaded') {
            allPeople = data;
            // 초기 결과 목록을 비워두거나, 전체 목록을 보여줄 수 있습니다.
            // 여기서는 초기에는 아무것도 보여주지 않도록 합니다.
            updateResultsList(resultsList, [], '');
            console.log(`애플리케이션이 초기화되었습니다.`);
            console.log(`총 ${allPeople.length}개의 이름이 로드되었습니다.`);
        } else if (type === 'error') {
            console.error("Worker 오류:", message);
            resultsList.innerHTML = `<li class="no-results">데이터 로딩 중 오류가 발생했습니다: ${message}</li>`;
            searchInput.disabled = true; // 데이터 로딩 중 오류 발생시 검색창 비활성화
        }
    };

    // Worker 오류 처리
    worker.onerror = function(error) {
        console.error("Worker 오류 발생:", error);
        resultsList.innerHTML = '<li class="no-results">Worker 오류가 발생했습니다.</li>';
        searchInput.disabled = true;
    };

    // CSV 데이터를 불러오도록 Worker에게 메시지 전송
    const csvFilePath = new URL('./assets/people-100000.csv', window.location.href).href;
    worker.postMessage({ filePath: csvFilePath });

    // 사용자의 input을 받는 핸들러 함수
    const handleSearchInput = () => {
        const query = searchInput.value;
        const matchingPeople = filterPeople(allPeople, query);
        const suggestion = getAutocompleteSuggestion(allPeople, query);

        updateResultsList(resultsList, matchingPeople, query);
        updateAutocompleteOverlay(autocompleteOverlay, suggestion, query);
    };

    // 위 핸들러 함수를 디바운스 처리한다. 지연시간은 300ms로 설정합니다.
    const debouncedSearch = debounce(handleSearchInput, 300);

    // 검색창 입력 이벤트 리스너
    searchInput.addEventListener('input', debouncedSearch);

    // 결과 목록 클릭 이벤트 리스너
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