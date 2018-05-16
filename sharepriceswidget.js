/*
 * Constructor function for a SharePricesWidget instance.
 * 
 * container_element : a DOM element inside which the widget will place its UI
 *
 */


function SharePricesWidget(container_element){
	//variables for the data properties of the widget
	var _this_widget_instance = this;
	var _container = container_element;
	var _data = new Array();
	var updated_data = new Array();
	var companies_avalible = ["", "NZ Wind Farms", "Foley Wines", "Geneva Finance", "Xero Live", "Moa Group Ltd", "Solution Dynamics"];
	var _id = _container.id;
	//an object literal representing the widget's UI
	var _ui = {
		//variables for the UI properties of the widget
		container: null,
		toolbar: null,
		monitor: null,
		data_display: null	
	};
	
	/**
	* Constructor function for an inner object to hold the full share data for a company
	*/
	var SharePricesLine = function(s_company, s_price, s_change){
		//variables for the data properties of one company's share information
		var company = s_company;
		var price = s_price;
		var change = s_change;
		
		//an object literal representing the UI for the share info
		var _ui = {
			//variables for the UI properties of the SharePricesLine
			table_row: null
		};
		
		/* function to create the DOM elements needed for the SharePricesLine UI
		*/
		var _createUI = function(){	
			//creating and initialising each of the UI elements and adding them to the _ui object
			var data_table = document.getElementById(_id+"data_table");
			_ui.table_row = document.createElement("tr");
			_ui.table_row.company_name = document.createElement("td");
			_ui.table_row.company_price = document.createElement("td");
			_ui.table_row.company_change = document.createElement("td");
			_ui.table_row.company_delete = document.createElement("td");
			_ui.table_row.company_name.appendChild(document.createTextNode(company));
			_ui.table_row.company_price.appendChild(document.createTextNode(price));
			_ui.table_row.company_change.appendChild(document.createTextNode(change));
			_ui.table_row.delete_button = document.createElement("input");
			_ui.table_row.delete_button.setAttribute("type", "button");
			_ui.table_row.delete_button.setAttribute("value", "-");
			_ui.table_row.company_delete.appendChild(_ui.table_row.delete_button);
			_ui.table_row.delete_button.onclick = function(){
				deleteRow(company);
			}	
			_ui.table_row.appendChild(_ui.table_row.company_name);
			_ui.table_row.appendChild(_ui.table_row.company_price);
			_ui.table_row.appendChild(_ui.table_row.company_change);
			_ui.table_row.appendChild(_ui.table_row.company_delete);
			data_table.appendChild(_ui.table_row);
			setColour(change);

		};
		
		//methods for SharePricesLine
		var setColour = function(change){
			if(change < 0){
				_ui.table_row.company_change.className = "negative_value";
			}
			if(change > 0){
				_ui.table_row.company_change.className = "positive_value";
			}
		}
		
		//this function is called last to build the UI
		_createUI();    
		
	};
	
	//methods for SharePricesWidget 
	
	var deleteRow = function(company_to_delete){
		//Delete data from the current data array _data
		for(var i = 0; i < _data.length; i++){
			if(_data[i][0] == company_to_delete){
				_data.splice(i, 1);
				break;
			}
		}
		//If all emelents of the table are removed so it the white background for the section
		if(_data.length == 0){
			_ui.data_display.setAttribute("class","data_display");
		}
		//Finding the corrosponding line to the company that needs to be deleted
		var rows = _ui.data_display.data_table.getElementsByTagName("tr");
		for(var i = 0; i < rows.length; i++) {
			var company = rows[i].getElementsByTagName("td")[0].innerHTML;
			if(company == company_to_delete){
				//Deleting the companys row in the table
				var parentNode = rows[i].parentElement;
				parentNode.removeChild(rows[i]);
				break;
			}
		}
	}
	
	//Used for selecting a company as well as fetching the updated data
	var getCompanyInfo = function(selected, type){
		var isIn = false;
		for(var i = 0; i < _data.length; i++){
			if(selected == "" || _data[i][0] == selected){
				isIn = true;
				break;
			}
		}
		//Ajax request to fetch the data from the data base of a particular company
		if(isIn == false){
			$.ajax("getData.php", {
				method: 'POST',
				data: {comp:selected},
				success: function(data){
					var myObj = JSON.parse(data);
					var price = myObj.Price;
					var change = myObj.Change;
					var data_obj = [selected,price,change];
					_data.push(data_obj);
					//if the type of this is select and not update then call the share line
					if(type == "select"){
						_ui.data_display.setAttribute("class","display_backg data_display");
						var share = new SharePricesLine(selected,price,change);
					}
					reSort();	
				},
			});
		}

	}
	
	//After update or adding, resort is called so the data can be sorted to the already
	//selected type without having to click on the radio button a second time
	var reSort = function(){
		if(_ui.monitor.price_radio.checked){
			sortTable(_ui.monitor.price_radio);
		}
		if(_ui.monitor.company_radio.checked){
			sortTable(_ui.monitor.company_radio);
		}
	}
	
	//sort the table, the value of which sort type is passed to the function
	var sortTable = function(radioValue){
		var sortType = radioValue.value;
		var switching = true;
		while (switching) {
			switching = false;
			var rows = _ui.data_display.data_table.getElementsByTagName("tr");
			for (var i = 0; i < (rows.length - 1); i++) {
				var switch_ = false;
				//company is a-z
				if(sortType == "company"){
					var x = rows[i].getElementsByTagName("td")[0];
					var y = rows[i + 1].getElementsByTagName("td")[0];
					var condition = x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase();
				}
				//price is numerical and the strings need to be changed to int
				if(sortType == "price"){
					var x = rows[i].getElementsByTagName("td")[1];
					var y = rows[i + 1].getElementsByTagName("td")[1];
					var condition = parseFloat(x.innerHTML) > parseFloat(y.innerHTML);
				}
				if (condition) {
					switch_ = true;
					break;
				}
			}
			if (switch_) {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
			}
		}
	}
	

	
	var updateData = function(){
		//adding the current _data to a place holder as a backup
		var _data_placeholder = _data;
		_data = new Array();
		
		//re adding in the updated values
		for(var i = 0; i < _data_placeholder.length; i++){
			getCompanyInfo(_data_placeholder[i][0],"update");
		}
		//finding the element and inserting the new price and price change value
		var rows = _ui.data_display.data_table.getElementsByTagName("tr");
		for(var i = 0; i < rows.length; i++) {
			var company = rows[i].getElementsByTagName("td")[0].innerHTML;
			for(var j = 0; j < _data.length; j++) {
				if(company == _data[j][0]){
					rows[i].getElementsByTagName("td")[1].innerHTML = _data[j][1];
					var price_change = rows[i].getElementsByTagName("td")[2];
					var new_price = _data[j][2];
					price_change.innerHTML = new_price;
					if(new_price < 0){
						price_change.className = "negative_value";
					}
					if(new_price > 0){
						price_change.className = "positive_value";
					}
					break;
				}
			}
		}
		reSort();
	}
	

	//private method to construct the DOM subtree for the UI and put into container element
	var _createUI = function(){
		//creates the DOM elements needed for the widget and adds to the _ui var
		
		_ui.container = container_element;
		_ui.container.className = "title";
		//TOOLBAR
		_ui.toolbar = document.createElement("div");
		_ui.toolbar.className = "toolbar";
		_ui.container.appendChild(_ui.toolbar);
		
		_ui.toolbar.appendChild(document.createTextNode("Select Company: "));
		_ui.toolbar.select_box = document.createElement("select");
		_ui.toolbar.select_box.setAttribute("id",_id+"my_select");
		var array_length = companies_avalible.length;
		for(var i = 0; i < array_length; i++){
			_ui.toolbar.option_place = document.createElement("option");
			_ui.toolbar.option_place.setAttribute("value", companies_avalible[i]);
			_ui.toolbar.select_box.appendChild(_ui.toolbar.option_place);
			_ui.toolbar.option_place.appendChild(document.createTextNode(companies_avalible[i]));
		}
		_ui.toolbar.appendChild(_ui.toolbar.select_box);
		_ui.toolbar.select_box.onchange = function(){
			getCompanyInfo(_ui.toolbar.select_box.value,"select");
		}
		_ui.toolbar.update_button = document.createElement("input");
		_ui.toolbar.update_button.setAttribute("type", "button");
		_ui.toolbar.update_button.setAttribute("value", "Update");
		_ui.toolbar.update_button.setAttribute("id",_id+"update_button");
		_ui.toolbar.update_button.onclick = function(){
			updateData();
		}	
		_ui.toolbar.appendChild(_ui.toolbar.update_button);

		
		
		//MONITOR
		_ui.monitor = document.createElement("div");
		_ui.monitor.id = _id+"monitor";
		_ui.monitor.className = "monitor";
		_ui.container.appendChild(_ui.monitor);
		//child 1
		_ui.monitor.form_ = document.createElement("form");
		_ui.monitor.form_.setAttribute = ("id", _id+"sort_type_form");
		_ui.monitor.appendChild(_ui.monitor.form_);
		//forms child 1
		_ui.monitor.form_.appendChild(document.createTextNode("Sort By: "));
		//forms child 2
		_ui.monitor.company_label = document.createElement("label");
		_ui.monitor.company_label.className = "section_label";
		_ui.monitor.form_.appendChild(_ui.monitor.company_label);
		//company label - child 1
		_ui.monitor.company_label.appendChild(document.createTextNode("Company "));
		//company label - child 2
		_ui.monitor.company_radio = document.createElement("input");
		_ui.monitor.company_radio.setAttribute("type", "radio");
		_ui.monitor.company_radio.setAttribute("name", "sort_type");
		_ui.monitor.company_radio.setAttribute("value", "company");
		_ui.monitor.company_radio.setAttribute("id",_id+"company_radio");
		_ui.monitor.company_label.appendChild(_ui.monitor.company_radio);
		_ui.monitor.company_radio.onclick = function(){
			sortTable(this);
		}

		//forms child 3
		_ui.monitor.price_label = document.createElement("label");
		_ui.monitor.price_label.className = "section_label";
		_ui.monitor.form_.appendChild(_ui.monitor.price_label);
		//price label - child 1
		_ui.monitor.price_label.appendChild(document.createTextNode("Price "));
		//price label - child 2
		_ui.monitor.price_radio = document.createElement("input");
		_ui.monitor.price_radio.setAttribute("type", "radio");
		_ui.monitor.price_radio.setAttribute("name", "sort_type");
		_ui.monitor.price_radio.setAttribute("value", "price");
		_ui.monitor.price_radio.setAttribute("id",_id+"price_radio");
		_ui.monitor.price_label.appendChild(_ui.monitor.price_radio);
		_ui.monitor.price_radio.onclick = function(){
			sortTable(this);
		}

		//DATA DISPLAY
		_ui.data_display = document.createElement("div");
		_ui.container.appendChild(_ui.data_display);
		_ui.data_display.id = _id+"data_display";
		_ui.data_display.data_table = document.createElement("table");
		_ui.data_display.data_table.id = _id+"data_table";		
		_ui.data_display.appendChild(_ui.data_display.data_table);
	
	}
	
	
	 /**
	  * private method to intialise the widget's UI on start up
	  */
			
	var _initialise = function(container_element){
		_createUI(container_element);

	}
	  	
	_initialise(container_element);   //finally the _initialise function is called


}

	 

	 
	 