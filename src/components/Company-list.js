import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import firebase from '../Firebase';
import ReactApexChart from 'react-apexcharts';
import swal from 'sweetalert';
import '../App.css';
import './Company-list.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

class Companylist extends Component {

	constructor(props) {
		super(props);
		this.ref = firebase.firestore().collection('company');
		this.unsubscribe = null;
		this.state = {
			user: [],
			array:[],
			searchResponse: [],
			results: [],
			companyData: [],
			query: '',
			value: '',
			searchValue: '',
			companySymbol: '',
			companyName: '',
			symbol: '',
			name: '',
			userEmail: '',
			grapharray: [],
			date: "",
			open: '',
			close: '',
			high: '',
			low: '',
			volume: '',
			clickCompanyName: '',
			clickCompanySymbol: '',
			isToggleOn: true,
			isLoaded: false,
			isSearchClick: false,
			isOpenSearch: false,
			isOpenCompanyList: false
		};
		this.handleClick1 = this.handleClick1.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getCompany = this.getCompany.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.openSeachbar = this.openSeachbar.bind(this);
		this.displayCompanyList = this.displayCompanyList.bind(this);

	}

	handleChange(event) {
		this.setState({value: event.target.value,searchValue: event.target.value});
	}

	handleSubmit(event) {
		this.setState({value:'',isLoaded: false});
		if(!this.state.value){
			swal("Please, Enter value","", "info");
		} else{
			console.log("name:",this.state.value);
			console.log("searchValue",this.state.searchValue);
			event.preventDefault();
			this.getApiData();
			this.setState({value:''});
		}
	}

	handleInputChange = () => {
		this.setState({
			query: this.search.value
		}, () => {
			console.log("query:",this.state.query);
			if (this.state.query && this.state.query.length > 1) {
				if (this.state.query.length % 2 === 0) {
					this.getInfo()
				}
			} else if (!this.state.query) {
			}
		})
	}

	handleClick1(data) {
		console.log('data: ', data);
		this.setState({companySymbol: data['1. symbol'],companyName: data['2. name']});
		this.getApiData();
		this.addComapny();
	}

	getInfo = () => {
		axios.get("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+this.state.value+"&apikey=Z51NHQ9W28LJMOHB")
		.then(({ data }) => {
			this.setState({
				results: data.data
			})
		})
	}

	addComapny(){
		if (this.state.companySymbol) {
			console.log("addCompany2:",this.state.companySymbol);
			return(
				swal({
					title: this.state.companySymbol,
					text: this.state.companyName,
					icon: "success",
					dangerMode: true,
				}).then((willDelete) => {
					if(willDelete){
						this.updateCompany(this.state.companyName)
					} else{
						console.log("no data found");
					}
				})
				)
		}
	}

	updateCompany = (companyName) =>{
		console.log('updatecompany:');
		localStorage.getItem('email1')
		let email = localStorage.email1;
		console.log(companyName)
		let companyData = [];
		firebase.firestore().collection("company").where("name", "==", companyName).where("email", "==", email) 
		.get()
		.then(function(querySnapshot) {
			console.log("querySnapshot",querySnapshot)
			querySnapshot.forEach(function(doc) {
				const { name, email } = doc.data();
				console.log("data:",doc.data())
				companyData.push({
					key: doc.id,
					doc,
					name,
					email,
				});
			});
			console.log("data1:",companyData.length);
			if (companyData.length) {
				console.log('found data', companyData);
				swal("Already added!","", "info")
				.then((willDelete) => {
					if(willDelete){
						window.location.reload();
					}
				})
			} else{
				console.log("new company");
				addCompany1()
			}
		});

		let addCompany1 = () =>{
			localStorage.getItem('email1')
			let email = localStorage.email1;
			console.log("isLoaded before:",this.state.isLoaded);
			this.ref.add({
				symbol:this.state.companySymbol,
				name:this.state.companyName,
				email: email
			}).then((docRef) => {
			})
				window.location.reload()
			.catch((error) => {
				// this.displayCompanyList()

			// 	this.setState({
			// 		name: this.state.companyName,
			// 		symbol: this.state.companySymbol,
			// 		email: email,
			// 		isLoaded: true
			// 	});
			// 	console.log("isLoaded after:",this.state.isLoaded);
			// 	console.log("name:",this.state.companyName + "symbol:",this.state.companySymbol);
			// 	this.interval = setInterval(() => {
			// 		window.location.reload();
			// 	}, -1000);
			// })
			// .catch((error) => {

				console.error("Error adding document: ", error);
			})
		}
	}

	displayCompanyList(){
		const {date} = this.state;
		if (this.state.grapharray.length) {
			console.log('hey i m called');
			let graphSeries = this.state.grapharray;
			console.log("length:",graphSeries.length);
			let ts2 = 1484418600000;
			let graphData = [];
			for (let i = 0; i < graphSeries.length; i++) {
				ts2 = ts2 + 86400000;
				let obj = JSON.parse(graphSeries[i].volume)
				let innerArr = [ts2,obj];
				graphData.push(innerArr);
			}
			console.log("graphData:",graphData);
			let  options ={
				chart: {
					stacked: false,
					zoom: {
						type: 'x',
						enabled: true
					},
					toolbar: {
						autoSelected: 'zoom'
					}
				},
				plotOptions: {
					line: {
						curve: 'smooth',
					}
				},
				dataLabels: {
					enabled: false
				},

				markers: {
					size: 0,
					style: 'full',
				},
				colors: ['#ff4d4d'],
				opacity: 0.4,
				title: {
					text: 'Stock Price Movement',
					align: 'left'
				},
				fill: {
					type: 'gradient',
					gradient: {
						shadeIntensity: 1,
						inverseColors: false,
						opacityFrom: 0.5,
						opacityTo: 0,
						stops: [0, 90, 100]
					},
				},
				yaxis: {
					min: 0,
					max: 250000,
					labels: {
						formatter: function (val) {
							return (val).toFixed(0);
						},
					},
					title: {
						text: 'Price'
					},
				},
				xaxis: {
					type: 'datetime',
				},
				tooltip: {
					shared: false,
					y: {
						formatter: function (val) {
							return (val/1000).toFixed(0)
						}
					}
				}
			}
			let series = [{
				name: 'Stock price',
				data: graphData
			},
			]
			var chartrender = <div id="chart">
			<ReactApexChart options={options} series={series} type="area" height="450" />
			<span style={{color:'gray'}}>Open: </span> <span style = {{marginRight:10}}>{this.state.open}</span>
			<span style={{color:'gray'}}>Close: </span> <span style = {{marginRight:10}}>{this.state.close}</span>
			<span style={{color:'gray'}}>High: </span> <span style = {{marginRight:10}}>{this.state.high}</span>
			<span style={{color:'gray'}}>Low: </span> <span style = {{marginRight:10}}>{this.state.low}</span>
			<span style={{color:'gray'}}>Volume: </span> <span style = {{marginRight:10}}>{this.state.volume}</span>
			</div>
		}
		var showGraphOrSearchResult = this.state.searchResponse.length ? <div>
		<center><h3>Search Response....</h3></center>
		{this.state.searchResponse.map(data =>	
			<List key={data['1. symbol']} className="list">
			<ListItem>
			<ListItemText className="search_list" primary={data['1. symbol']} secondary={data['2. name']} />
			<ListItemSecondaryAction className="search_list1">
			<IconButton color="primary" edge="end" aria-label="Delete" onClick={() =>this.handleClick1(data)} className="addIcon">
			<AddIcon/>
			</IconButton>
			</ListItemSecondaryAction>
			</ListItem>
			</List>
			)}
		</div> : (this.state.searchResponse ? <div>
			<span className="company_symbol">{this.state.clickCompanySymbol}</span><span style={{color: 'gray'}}>{this.state.clickCompanyName}</span>
			{chartrender ? chartrender : ''}
			</div> : 'No data found')
		var displayCompany = this.state.companyData.length ? <div>{this.state.companyData.map(company =>
			<List key={company.key} className="cursorClass">
			<ListItem onClick={() =>this.handleClick(company)}>
			<ListItemText primary={company.symbol} secondary={company.name}/>
			<ListItemSecondaryAction>
			<IconButton edge="end" aria-label="Delete" style={{color:'#ff4d4d'}} onClick={this.deleteCompany.bind(this, company.key)}>
			<RemoveCircle/>
			</IconButton>
			</ListItemSecondaryAction>
			</ListItem>
			</List>
			)} </div> : <div> <center><p>Add Comapany to watchlist</p></center></div>
		var displayData =  this.state.companyData.length ? <div>{showGraphOrSearchResult}</div> : <div><center><h2>No Company Found</h2></center></div>
		if(this.state.isOpenSearch && !this.state.isSearchClick){
			console.log("===========if=======");
			return(
				<div>
				<div className="grid_class">
				<span style={{fontSize :25,marginLeft:8,color:'#fff'}}><b>Stock</b></span><br/>
				<span style={{fontSize:17,color:'gray',marginLeft:8}}>{date}</span>
				<div className="logout">
				<Link to ="/login"><Button variant="contained"  onClick={()=>this.logOut()}>
				<b>Logout</b>
				</Button></Link>
				</div>
				</div>

				{this.addComapny()}
				<div className="grid_class1">
				<div className="company_list">

				<Grid container spacing={1}>
				<Grid item sm={10}>
				<p style={{marginLeft: 18}}>Manage WatchList</p>
				</Grid>
				<Grid item sm={2}>
				<p onClick={()=>this.openCompanyList()} style={{color:'#3f51b5',cursor:'pointer'}}>Done</p>
				</Grid>
				</Grid>
				{this.state.companyData.map(company =>
					<List key={company.key} className="vl" >
					<ListItem >
					<ListItemText primary={company.symbol} secondary={company.name}/>
					<ListItemSecondaryAction>
					<IconButton edge="end"  aria-label="Delete" style={{color:'#ff4d4d'}} onClick={this.deleteCompany.bind(this, company.key)}>
					<RemoveCircle/>
					</IconButton>
					</ListItemSecondaryAction>
					</ListItem>
					</List>
					)}
				</div>
				<div className="search_bar">
				<Typography variant="h6" noWrap>
				<TextField
				id="outlined-with-placeholder"
				label="Search"
				className="search_input"
				value={this.state.value}
				onChange={this.handleChange} 
				margin="normal"
				variant="outlined"
				/>
				<Button id="search"  onClick={this.handleSubmit} style={{color:'#fff'}} disabled={!this.state.value} autoFocus>
				Search
				</Button>
				</Typography>
				</div>					
				</div>
				</div>
				)
		} else if(this.state.isSearchClick ){
			if(!this.state.searchResponse.length){
				console.log("========else if ========if======");
				return(
					<div>
					<div className="grid_class">
					<span style={{fontSize :25,marginLeft:8,color:'#fff'}}><b>Stock</b></span><br/>
					<span style={{fontSize:17,color:'gray',marginLeft:8}}>{date}</span>
					<div className="logout">
					<Link to ="/login"><Button variant="contained"  onClick={()=>this.logOut()}>
					<b>Logout</b>
					</Button></Link>
					</div>
					</div>

					{this.addComapny()}
					<div className="grid_class1">
					<div className="company_list">

					<Grid container spacing={12}>
					<Grid item sm={10}>
					<p style={{marginLeft: 18}}>Manage Watchlist</p>
					</Grid>
					<Grid item sm={2}>
					<p onClick={()=>this.openCompanyList()} style={{color:'#3f51b5'}}>Done</p>
					</Grid>
					</Grid>
					{this.state.companyData.map(company =>
						<List key={company.key} className="cursorClass vl">
						<ListItem onClick={() =>this.handleClick(company)}>
						<ListItemText primary={company.symbol} secondary={company.name}/>
						<ListItemSecondaryAction>
						<IconButton edge="end" aria-label="Delete" style={{color:'#ff4d4d'}} onClick={this.deleteCompany.bind(this, company.key)}>
						<RemoveCircle/>
						</IconButton>
						</ListItemSecondaryAction>
						</ListItem>
						</List>
						)}
					</div>	
					<div className="searching_list">

					<center><div className="searchCompany_list">
					<p style={{marginRight:296}}>Showing Results for: <span style={{textTransform: 'capitalize'}}><b>{this.state.searchValue}</b></span></p>
					No Data Found
					</div>	</center>
					</div>			
					</div>
					</div>
					)
			} else{
				console.log("else if =========else");
				return(
					<div>
					<div className="grid_class">
					<span style={{fontSize :25,marginLeft:8,color:'#fff'}}><b>Stock</b></span><br/>
					<span style={{fontSize:17,color:'gray',marginLeft:8}}>{date}</span>
					<div className="logout">
					<Link to ="/login"><Button variant="contained"  onClick={()=>this.logOut()}>
					<b>Logout</b>
					</Button></Link>
					</div>
					</div>
					{this.addComapny()}
					<div className="grid_class1">
					<div className="company_list">

					<Grid container spacing={1}>
					<Grid item sm={10}>
					<p style={{marginLeft: 18}}>Manage Watchlist</p>
					</Grid>
					<Grid item sm={2}>
					<p onClick={()=>this.openCompanyList()} style={{color:'#3f51b5',cursor:'pointer'}}>Done</p>
					</Grid>
					</Grid>
					{this.state.companyData.map(company =>
						<List key={company.key} >
						<ListItem className="vl">
						<ListItemText primary={company.symbol} secondary={company.name}/>
						<ListItemSecondaryAction>
						<IconButton edge="end" aria-label="Delete" style={{color:'#ff4d4d'}} onClick={this.deleteCompany.bind(this, company.key)}>
						<RemoveCircle/>
						</IconButton>
						</ListItemSecondaryAction>
						</ListItem>
						</List>
						)}
					</div>	
					<div className="search_bar">
					<Typography variant="h6" noWrap>
					<TextField
					id="outlined-with-placeholder"
					label="Search"
					className="search_input"
					value={this.state.value}
					onChange={this.handleChange} 
					margin="normal"
					variant="outlined"
					/>
					<Button className="search_button" id="search" disabled={!this.state.value} onClick={this.handleSubmit} style={{color:'#fff'}} autoFocus>
					Search
					</Button>
					</Typography>

					<center><div className="searchCompany_list">
					<p style={{marginRight:296}}>Showing Results for: <span style={{textTransform: 'capitalize'}}><b>{this.state.searchValue}</b></span></p>

					{this.state.searchResponse.map(data =>	
						<List key={data['1. symbol']} >
						<ListItem>
						<ListItemText  primary={data['1. symbol']} secondary={data['2. name']} />
						<ListItemSecondaryAction >
						<IconButton color="primary" edge="end" aria-label="Delete" onClick={() =>this.handleClick1(data)} >
						<AddIcon/>
						</IconButton>
						</ListItemSecondaryAction>
						</ListItem>
						</List>
						)}
					</div>	</center>
					</div>		
					</div>
					</div>
					)
			}

		}else{
			if(!this.state.isOpenCompanyList){

				console.log("=====else ==========if");
				return (
					<div>
					<div className="grid_class">
					<span style={{fontSize :28,marginLeft:8,color:'#fff'}}><b>Stock</b></span><br/>
					<span style={{fontSize:17,color:'gray',marginLeft:8}}>{date}</span>
					<div className="logout">
					<Link to ="/login"><Button variant="contained" onClick={()=>this.logOut()}>
					<b>Logout</b>
					</Button></Link>
					</div>
					</div>
					<div className="grid_class1">
					<div className="company_list">
					<div className="plus_class">
					<Grid container spacing={1}>
					<Grid item sm={4}>
					<IconButton color="primary" edge="end" aria-label="Delete" className="addIcon" onClick={()=>this.openSeachbar()}>
					<AddIcon />
					</IconButton>
					</Grid>
					<Grid item sm={8}>
					<p><b>Manage WatchList</b></p>
					</Grid>
					</Grid>
					</div>
					{displayCompany}
					</div>
					<div className="graph_list">
					{displayData}
					</div>
					</div>
					</div>
					)
			}

		}
	}	

	addSearchCompany(){
		this.setState({isSearchClick: false})
	}

	getApiData() {
		console.log("value:",this.state.value);
		axios.get("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+this.state.value+"&apikey=Z51NHQ9W28LJMOHB")
		.then((data)=>{
			console.log("data of response:",data.data['bestMatches']);
			this.setState({
				searchResponse: data.data['bestMatches'],
				isSearchClick: true,
				isLoaded: true
			});
			if(!this.state.searchResponse.length){
				console.log("searchrespone:",this.state.searchResponse.length);
				console.log("===if callling===");
				return(
					<div>
					"No Data Found"
					</div>
					)
			}
		}).catch(function(error) {
			console.log("Error getting documents: ", error);
		});
	}

	componentDidMount() {
		this.getCompany();
		this.getDate();
		this.unsubscribe = this.ref.onSnapshot(this.getCompany);
	}

	getDate = () => {
		var date = new Date().toDateString();
		this.setState({ date });
	};

	getCompany(){
		let companyData = [];
		localStorage.getItem('email1')
		let email = localStorage.email1;
		console.log('email==========>',email);
		firebase.firestore().collection("company").where("email", "==", email)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				const { name, symbol } = doc.data();
				companyData.push({
					key: doc.id,
					doc,
					name,
					symbol,
				});
			});
			setLoader(true);
			if (companyData.length) {
				console.log('found data==========>', companyData);
				setTheState(companyData);
				// if(this.state.isOpenCompanyList){
					console.log("call");
					displayGraph()
				// }

			}else{
				return(
					<div>
					<p>No data found</p>
					</div>
					)
			}
		}).catch(function(error) {
			console.log("Error getting documents: ", error);
		});

		var setLoader = (isLoaded) =>{
			this.setState({
				isLoaded: isLoaded
			})
		}

		var setTheState = (companyData) =>{
			this.setState({
				companyData: companyData,
				isLoaded: true
			})
		}
		var displayGraph = () => {
			console.log("companyData before:",this.state.companyData);
			console.log("companyData:",this.state.companyData);
			let firstCompanySymbol = this.state.companyData[1];
			console.log("firstCompanySymbol",firstCompanySymbol);
			this.handleClick(firstCompanySymbol)
		}
	}	


	deleteCompany(id){
		firebase.firestore().collection('company').doc(id).delete().then(() => {
			console.log("cdata:",this.state.companyData);
			swal("Successfully deleted!","", "success");
			console.log("Document successfully deleted!");
			// this.componentDidMount();
			if(this.state.companyData.length === 1 ){
				window.location.reload();
			}
		}).catch((error) => {
			console.log("Error removing document: ", error);
		});
	}	

	handleClick(data) {
		this.setState({
			isLoaded: false
		})
		console.log('data: ', data);
		let grapharray = [];
		const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+data.symbol+"&name=apple&interval=5min&apikey= Z51NHQ9W28LJMOHB";
		fetch(url)
		.then(res => res.json())
		.then(res => {console.log(res); return res;})
		.then(res => {
			if(!res){
				swal("Click after a minute");
			} else{
				const originalObject = res['Time Series (5min)'];
				for (let key in originalObject) {
					grapharray.push({
						date: key,
						open: originalObject[key]['1. open'],
						high: originalObject[key]['2. high'],
						low: originalObject[key]['3. low'],
						close: originalObject[key]['4. close'],
						volume: originalObject[key]['5. volume']
					})
				}
				console.log('grapharray: ', grapharray);
				console.log("open:",grapharray['0'].open);
				this.setState({
					grapharray: grapharray,
					open: grapharray['0'].open,
					close: grapharray['0'].close,
					high: grapharray['0'].high,
					low: grapharray['0'].low,
					volume: grapharray['0'].volume,
					clickCompanyName: data.name,
					clickCompanySymbol: data.symbol,
					isLoaded: true
				})
			}

		}).catch((error )=> {console.log('hello error: ', error)
		this.setState({isLoaded: true})
		return(
					<div>
					<div className="grid_class">
					<span style={{fontSize :25,marginLeft:8,color:'#fff'}}><b>Stock</b></span><br/>
					<div className="logout">
					<Link to ="/login"><Button variant="contained"  onClick={()=>this.logOut()}>
					<b>Logout</b>
					</Button></Link>
					</div>
					</div>
					{this.addComapny()}
					<div className="grid_class1">
					<div className="company_list">

					<Grid container spacing={1}>
					<Grid item sm={10}>
					<p style={{marginLeft: 18}}>Manage Watchlist</p>
					</Grid>
					<Grid item sm={2}>
					<p onClick={()=>this.openCompanyList()} style={{color:'#3f51b5',cursor:'pointer'}}>Done</p>
					</Grid>
					</Grid>
					{this.state.companyData.map(company =>
						<List key={company.key} >
						<ListItem className="vl">
						<ListItemText primary={company.symbol} secondary={company.name}/>
						<ListItemSecondaryAction>
						<IconButton edge="end" aria-label="Delete" style={{color:'#ff4d4d'}} onClick={this.deleteCompany.bind(this, company.key)}>
						<RemoveCircle/>
						</IconButton>
						</ListItemSecondaryAction>
						</ListItem>
						</List>
						)}
					</div>	
					<div className="search_bar">
					<Typography variant="h6" noWrap>
					<TextField
					id="outlined-with-placeholder"
					label="Search"
					className="search_input"
					value={this.state.value}
					onChange={this.handleChange} 
					margin="normal"
					variant="outlined"
					/>
					<Button className="search_button" id="search" disabled={!this.state.value} onClick={this.handleSubmit} style={{color:'#fff'}} autoFocus>
					Search
					</Button>
					</Typography>

					<center><div className="searchCompany_list">
					Click for graph after a minute
					</div>	</center>
					</div>		
					</div>
					</div>
					)
		
	});
		// axios.get(url, (error, response) => {
		// 	console.log('error: ', error);
		// 	console.log('response: ', response);
		// });
		// swal("Click after a minute");
		
	}	

	logOut(){
		firebase
		.auth()
		.signOut().then(function() {
			console.log('Signed Out');
			localStorage.getItem('email1');
			console.log(localStorage);
			localStorage.clear();
			localStorage.removeItem('email1');
			console.log(localStorage);
			window.location.hash="/"
		}, function(error) {
			console.error('Sign Out Error', error);
		});
	}

	openSeachbar(){
		this.setState({
			isOpenSearch: true
		});
	}

	openCompanyList(){
		this.setState({isOpenCompanyList: false})
		console.log("isOpenCompanyList:",this.state.isOpenCompanyList);
		window.location.hash='/Copmpany-list';
	}

	render() {

		const { isLoaded} = this.state;

		if (!isLoaded) {
			return (
				<center>
				<div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
				</center>
				)
		} else if(isLoaded){
			if(this.state.companyData.length){
				return(
					<div className="main">
					{this.displayCompanyList()}
					</div>
					)
			} else{
				return(
					<div className="main">
					{this.displayCompanyList()}
					</div>
					)
			}

		} else{
			return(
				<div>
				<h2>Sorry no data found</h2>
				</div>
				);
		}
	}

}


export default Companylist

