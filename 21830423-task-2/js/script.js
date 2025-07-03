/**
 * 이름 데이터를 불러오는 함수입니다.
 * - getNamesData로 함수 이름을 변경하여 가독성을 높였습니다.
 * - toSorted() 함수를 추가하여 이름이 알파벳 순서대로 정렬되도록 개선하였습니다.
 * - 추가 요건 3에 맞게 로컬 CSV 파일을 불러오도록 수정하였습니다.
 * @param {string} filePath - CSV 파일 경로 (기본 경로: './assets/names.csv')
 * @returns {Promise<string[]>} 이름 배열을 담은 Promise
 */
function getNamesData(filePath = './assets/names.csv') {
    return new Promise((resolve, reject) => {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    // 에러 처리
                    // 지금은 로컬에서 CSV 파일을 불러오기 때문에 파일 경로가 잘못되지 않았는지 꼭 확인해주세요.
                    console.error(`CSV 파일 불러오기 실패: ${response.status} ${response.statusText}`);
                    return response.text().then(() => {
                        throw new Error(`HTTP 에러 상태: ${response.status}`);
                    });
                }
                return response.text();
            })
            .then(csvData => {
                // CSV 파일에서 이름 데이터를 불러와 사전순으로 정렬합니다.
                const names = csvData
                    .split(',')
                    .map(name => name.trim())
                    .filter(name => name.length > 0);
                resolve(names.toSorted());
            })
            .catch(error => {
                console.error("CSV 파일 처리 중 오류가 발생하였습니다:", error);
                reject(error);
            });
    });
}

/**
 * 유저가 입력한 검색어에 대해 매칭되는 이름 배열을 반환하는 함수입니다.
 * - findMatchingNames로 함수 이름을 변경하여 가독성을 높였습니다.
 * @param {string[]} nameList - 검색을 수행할 이름 배열
 * @param {string} query - 유저가 입력한 검색어
 * @returns {string[]} 검색어와 매칭된 이름 배열
 */
function findMatchingNames(nameList, query) {
    if (!query.trim()) {
        return [];
    }
    return nameList.filter(name =>
        name.toLowerCase().includes(query.toLowerCase())
    );
}

/**
 * 유저가 입력한 검색어로 시작하는 이름을 자동완성 힌트로 사용하는 함수입니다.
 * - findAutocompleteHint로 함수 이름을 변경하여 가독성을 높였습니다.
 * @param {string[]} nameList - 검색을 수행할 이름 배열
 * @param {string} query - 유저가 입력한 검색어
 * @returns {string|null} 검색어와 매칭된 이름
 */
function findAutocompleteHint(nameList, query) {
    if (!query.trim()) {
        return null;
    }
    const match = nameList.find(name =>
        name.toLowerCase().startsWith(query.toLowerCase())
    );
    return match || null;
}

/**
 * 유저가 입력한 검색어에 대해 검색 결과 리스트를 처리하는 함수입니다.
 * - 검색 결과 처리 함수와 자동완성 처리 함수을 분리하여 가독성을 높였습니다.
 * - 불필요한 함수가 반복되는 코드를 삭제하여 성능을 향상하였습니다.
 * @param {HTMLElement} listElement - UI가 갱신되는 태그
 * @param {string[]} matches - 사용자가 입력한 검색어와 매칭되는 이름 배열
 * @param {string} query - 사용자가 입력한 검색어
 */
function updateResultsList(listElement, matches, query) {
    // 기존의 removeChild() 함수로 UI를 초기화 하는 대신, 공백 코드로 UI를 초기화 합니다.
    listElement.innerHTML = '';

    if (matches.length === 0) {
        const message = query.trim() ? '검색 결과가 없습니다' : '검색어를 입력해주세요';
        listElement.innerHTML = `<li class="no-results">${message}</li>`;
    } else {
        matches.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            listElement.appendChild(li);
        });
    }
}

/**
 * 자동완성 힌트를 처리하는 함수입니다.
 * - 검색 결과 처리 함수와 자동완성 처리 함수을 분리하여 가독성을 높였습니다.
 * - 불필요한 함수가 반복되는 코드를 삭제하여 성능을 향상하였습니다.
 * - 예시) 유저가 Al을 입력 시, __exander 텍스트 오버레이를 덧씌워 자동완성 힌트를 제공합니다.
 * @param {HTMLElement} overlayElement - 자동완성 오버레이 태그
 * @param {string|null} hint - 전체 힌트
 * @param {string} query - 전체 힌트 중 유저가 입력한 부분
 */
function updateAutocomplete(overlayElement, hint, query) {
    // 기존 힌트를 초기화합니다.
    overlayElement.innerHTML = '';

    if (hint && query.length > 0) {
        // 유저가 입력한 텍스트와 동일한 길이의 텍스트를 투명하게 만들어 자동완성 힌트의 공백을 조정합니다.
        const typedPart = document.createElement('span');
        typedPart.style.color = 'transparent';
        typedPart.textContent = query;

        // 나머지 자동완성 힌트를 제공합니다.
        const hintPart = document.createElement('span');
        hintPart.className = 'autocomplete-hint';
        hintPart.textContent = hint.slice(query.length);

        overlayElement.appendChild(typedPart);
        overlayElement.appendChild(hintPart);
    }
}

// 코드를 분리하고 함수화하여 가독성을 높였습니다.
// 변수 이름을 직관적으로 변경하여 가독성을 높였습니다.
// 중복 함수 호출을 제거하여 성능을 개선하였습니다.
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsList = document.getElementById('resultsList');
    const autocompleteOverlay = document.getElementById('autocompleteOverlay');

    // 추가 요건 3에 따라 로컬 CSV 파일을 불러옵니다.
    getNamesData()
        .then(names => {
            if (names.length === 0) {
                console.error("이름 데이터를 불러오지 못했습니다. 파일 자체에 문제가 있지 않은지, 파일 경로에 문제가 있지 않은지 확인해주세요.");
                resultsList.innerHTML = '<li class="no-results">이름 데이터를 불러오지 못했습니다.</li>';
                searchInput.disabled = true; // 데이터 로딩 중 오류 발생시 검색창 비활성화
                return;
            }

            function handleSearchInput() {
                const query = searchInput.value;
                const matchingNames = findMatchingNames(names, query);
                const hint = findAutocompleteHint(names, query);

                updateResultsList(resultsList, matchingNames, query);
                updateAutocomplete(autocompleteOverlay, hint, query);
            }

            searchInput.addEventListener('input', handleSearchInput);

            console.log('애플리케이션이 초기화되었습니다.');
            console.log(`총 ${names.length}개의 이름이 로드되었습니다.`);
        })
        .catch(error => {
            console.error("CSV 데이터 로딩 중 오류 발생:", error);
            resultsList.innerHTML = '<li class="no-results">데이터 로딩 중 오류가 발생했습니다. CSV 파일과 경로를 다시 한 번 확인해주시고, CORS 오류가 발생한 경우 live-server를 통해 실행해주세요.</li>';
            searchInput.disabled = true; // 데이터 로딩 중 오류 발생시 검색창 비활성화
        });
});
