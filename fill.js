function fillContent() {
	fillSql();
	fillMemo();
}

function fillSql(){

	
	var depositId = document.getElementById("conditionValue").value;

	var index = depositId.substring(14,16);

	var sql = "select * from deposit_instruction_" + index + " where deposit_id='" +
	depositId + "'";

			
	var fillContent = "document.getElementById('querySql1').value=\"" + sql + "\"";

	chrome.tabs.executeScript(null, {code:fillContent});

}

function fillSchema(){
	var tablename = getTablename();
	if(tablename == "deposit_instruction"){
		var depositId = document.getElementById("conditionValue").value;
		var partitionIndex = depositId.substring(14,15);
		if(partitionIndex == '0') {
		
		}
	}
}



function fillMemo(){
	var memo = document.getElementById("memo").value;
	var fillContent = "document.getElementById('whyQuery').value=\"" + memo + "\"";
	chrome.tabs.executeScript(null, {code:fillContent});
}

function getTablename(){
	return document.getElementById("tablename").value;
}

function selectDomain(){
	resetAllTableList();
	var domains = document.getElementsByName("tableDomain");
	for(var i = 0;i < domains.length;i++) {
		if(domains[i].checked) {
			if(domains[i].value == 'pay') {
				selectAllTableList('pay');
				disableAllTableList('refund');
				disableAllTableList('deposit');
				disableAllTableList('transaction');
				fillOrderIdLabel('payment_id');
			}
			
			else if(domains[i].value == 'refund') {
				selectAllTableList('refund');
				disableAllTableList('pay');
				disableAllTableList('deposit');
				disableAllTableList('transaction');
				fillOrderIdLabel('refund_id');
			}
			
			else if(domains[i].value == 'deposit') {
				selectAllTableList('deposit');
				disableAllTableList('refund');
				disableAllTableList('pay');
				disableAllTableList('transaction');
				fillOrderIdLabel('deposit_id');				
			}
			
			else if(domains[i].value == 'transaction') {
				selectAllTableList('transaction');
				disableAllTableList('refund');
				disableAllTableList('deposit');
				disableAllTableList('pay');
				fillOrderIdLabel('tx_id');
			} 
			
			else {
				alert('让你Y的乱点~');
			}
		}
	}
}

function selectAllTableList(tableListName){
	var tableList = document.getElementsByName(tableListName + "TableList");
	for(var i=0; i < tableList.length;i++) {
		tableList[i].checked = true;
	}
}

function disableAllTableList(tableListName){
	var tableList = document.getElementsByName(tableListName + "TableList");
	for(var i=0; i < tableList.length;i++) {
		tableList[i].disabled = true;
	}
}

function resetAllTableList() {
	var allInput = document.getElementsByTagName("input");
	for(var i=0;i < allInput.length;i++) {
		if(allInput[i].type == 'checkbox') {
			allInput[i].checked = false;
			allInput[i].disabled = false;
		}
	}
}


function fillOrderIdLabel(labelName) {
	var label = document.getElementById('orderIdForLabel');
	label.innerHTML = labelName;
}

function generateSQL(){

	var domains = document.getElementsByName("tableDomain");
	for(var i = 0;i < domains.length;i++) {
		if(domains[i].checked) {
			if(domains[i].value == 'pay') {
				generatePaySQL();
			}
			
			else if(domains[i].value == 'refund') {
				generateRefundSQL();
			}
			
			else if(domains[i].value == 'deposit') {
				generateDepositSQL();
			}
			
			else if(domains[i].value == 'transaction') {
				generateTransactionSQL();
			} 
			
			else {
				alert('让你Y的乱点~');
			}
		}
	}
	
}

function generatePaySQL() {
	var paymentId = getOrderId();
	if(paymentId.length != 28) {
		alert('长度必须为28位~');
		return;
	}
	var tableList = document.getElementsByName('payTableList');
	var dbIndex = paymentId.substring(18,19);
	var tableIndex = paymentId.substring(16,17);
	
	var sqls = '';
	for(var i=0;i < tableList.length; i++) {
		var tableName = tableList[i].value;
		var sql = "select * from " + tableName + "_" + tableIndex + "_" + dbIndex + " where payment_id='" + paymentId + "';";
		sqls = sqls + sql + "\n";
	}
	
	printSQL(sqls);
		
	
}

function generateRefundSQL() {
	var refundId = getOrderId();
	if(refundId.length != 28) {
		alert('长度必须为28位~');
		return;
	}
	var tableList = document.getElementsByName('refundTableList');
	var dbIndex = refundId.substring(18,19);
	var tableIndex = refundId.substring(16,17);
	
	var sqls = '';
	for(var i=0;i < tableList.length; i++) {
		var tableName = tableList[i].value;
		var sql = "select * from " + tableName + "_" + tableIndex + "_" + dbIndex + " where refund_id ='" + refundId + "';";
		sqls = sqls + sql + "\n";
	}
	
	printSQL(sqls);
}

function generateDepositSQL() {
	
	var depositId = getOrderId();

	if(depositId.length != 16) {
		alert('长度必须为16位~');
		return;
	}
	var tableList = document.getElementsByName('depositTableList');
	var index = depositId.substring(14,16);

	var sqls = '';
	for(var i=0;i < tableList.length; i++) {
		var tableName = tableList[i].value;
		var sql = "select * from deposit_instruction_" + index + " where deposit_id='" + depositId + "';";
		sqls = sqls + sql + "\n";
	}
	
	printSQL(sqls);
}

function generateTransactionSQL() {
	
	var txId = getOrderId();

	var tableList = document.getElementsByName('transactionTableList');
	var index = Math.abs(hashCode(txId))%100 + '';
	if(index.length == 1) {
		index = 0  + index;
	}
	
	var sqls = '';
	for(var i=0;i < tableList.length; i++) {
		var tableName = tableList[i].value;
			var sql = "select * from " + tableName + "_" + index  + " where tx_id ='" + txId + "';";
		sqls = sqls + sql + "\n";
	}
	
	printSQL(sqls);
}

function getOrderId() {
	var orderId =  document.getElementById('orderIdForValue').value;
	if(orderId == '') {
		alert('单据号非空~');
	} else {
		return orderId;
	}
}

function printSQL(sqls) {
	document.getElementById('sqlContent').value = sqls;
}

function hashCode(element){
    var hash = 0;
    if (element.length == 0) return hash;
    for (i = 0; i < element.length; i++) {
        char = element.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; 
    }
    return hash;
}



document.addEventListener('DOMContentLoaded', function () {
  var inject = document.getElementById("inject");
  inject.addEventListener('click', generateSQL);

  var inject = document.getElementById("pay");
  inject.addEventListener('click', selectDomain);

  var inject = document.getElementById("refund");
  inject.addEventListener('click', selectDomain);

  var inject = document.getElementById("deposit");
  inject.addEventListener('click', selectDomain);

  var inject = document.getElementById("transaction");
  inject.addEventListener('click', selectDomain);

});






