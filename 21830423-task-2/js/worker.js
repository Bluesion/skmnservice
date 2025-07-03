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
 * 지정된 CSV 텍스트를 파싱하고 정렬합니다.
 *
 * @param {string} csvText - CSV 파일의 전체 텍스트 내용
 * @returns {Object[]} 각 행을 매핑된 속성명으로 나타내는 객체 배열
 */
function processCsvData(csvText) {
    const data = [];
    const lines = csvText.trim().split('\n');

    if (lines.length < 2) {
        console.warn("CSV 파일이 비어있거나 헤더만 포함되어 있습니다. 파일을 확인해주세요.");
        return [];
    }

    const rawHeaders = parseCSVLine(lines[0]);
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

    const jsHeaders = rawHeaders.map(rawHeader => headerMap[rawHeader] || rawHeader.toLowerCase().replace(/\s+/g, ''));

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

    data.sort((a, b) => {
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    return data;
}

// 웹 워커 메시지 핸들러
self.onmessage = function(event) {
    const { filePath } = event.data;

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${filePath} 불러오기 실패: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(csvText => {
            const processedData = processCsvData(csvText);
            self.postMessage({ type: 'dataLoaded', data: processedData });
        })
        .catch(error => {
            console.error("Worker: CSV 파일 처리 중 오류가 발생하였습니다: ", error);
            self.postMessage({ type: 'error', message: error.message });
        });
};