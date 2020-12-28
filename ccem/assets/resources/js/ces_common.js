/**
 * api 오류 체크
 * @param {object} response 
 * @param {object} settings 
 */
const checkApi = (response, settings) => {
	if (response.errcode != "0") {
		if(typeof client != 'undefined') {
			let errMsg = `서버에서 오류가 발생하였습니다.<br><br>오류코드 : ${response.errcode}<br>오류메시지 : ${response.errmsg}<br>호출서비스 : ${settings.url}`;
			client.invoke("notify", errMsg, "error", 60000);
		}
		else {
			let errMsg = `서버에서 오류가 발생하였습니다.\n\n오류코드 : ${response.errcode}\n오류메시지 : ${response.errmsg}\n호출서비스 : ${settings.url}`
			alert(errMsg);
		}
		return false;
	}
	return true;
}

/**
 * 날짜계산 함수
 * @param {string} type year, month, day
 * @param {number} num 
 */
const getDateFormat = (type, num) => {
    let date = new Date();
    if (typeof type == "string" && typeof num == "number") {
        if (type == "year") {
            date.setFullYear(date.getFullYear() + num);
        } else if (type == "month") {
            date.setMonth(date.getMonth() + num);
        } else if (type == "day") {
            date.setDate(date.getDate() + num);
        }
    }
    let y = date.getFullYear();
    let m = ("0" + (date.getMonth() + 1)).slice(-2);
    let d = ("0" + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
}

/**
 * 시간
 */
const getTimeFormat = () => {
	let today = new Date();   
	let h = ("0"+today.getHours()).slice(-2); 
	let m = ("0" + today.getMinutes()).slice(-2);
	let s = ("0" + today.getSeconds()).slice(-2);
	return `${h}:${m}:${s}`;
}

/**
 * @param {object} tableEl 
 * @param {string} fileName 
 */
const tableToExcel = (tableEl, fileName) => {
	let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
	tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
	tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
	tab_text = tab_text + '<x:Name>Sheet1</x:Name>';
	tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes>';
	tab_text = tab_text + '/x:WorksheetOptions></x:ExcelWorksheet>';
	tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head>';
	tab_text = tab_text + "<body><table border='1px'>";
	tab_text = tab_text + tableEl.html();
	tab_text = tab_text + '</table></body></html>';
	// let data_type = 'data:application/vnd.ms-excel';
	let data_type = 'application/csv;charset=utf-8;';
	let ua = window.navigator.userAgent;
	let msie = ua.indexOf("MSIE ");
	let blob = new Blob([tab_text], { type: data_type });
	//Explorer 환경에서 다운로드
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		if (window.navigator.msSaveBlob) navigator.msSaveBlob(blob, fileName);
	} else {
		let elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = fileName;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
}