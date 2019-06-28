import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import firebase from '../Firebase';
import ReactApexChart from 'react-apexcharts';
import Config from '../config';
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
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
let config = new Config();
let options = {
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
				return (val / 1000).toFixed(0)
			}
		}
	}
}

let options1 = {
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
		min: 500000,
		max: 5500000,
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
				return (val / 1000).toFixed(0)
			}
		}
	}
}

const ranges = [
	{
		value: '1min',
		label: '1 min',
	},
	{
		value: '5min',
		label: '5 mins',
	},
	{
		value: '15min',
		label: '15 mins',
	},
	{
		value: '30min',
		label: '30 mins',
	},
	{
		value: '60min',
		label: '1 hour',
	},
	{
		value: 'WEEKLY',
		label: '1 week',
	},
	{
		value: 'MONTHLY',
		label: '1 month',
	},
];


class Companylist extends Component {

	constructor(props) {
		super(props);
		this.ref = firebase.firestore().collection('company');
		this.unsubscribe = null;
		this.state = {
			user: [],
			array: [],
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
			indicatorObj: '',
			historicalArray: [],
			intervalArray: [],
			graphData: [],
			intervalData: [],
			comparisonArray1: [],
			comparisonArray2: [],
			indicatorDataArray: [],
			indicatorGraphData: [],
			comparisonOfVolume: [],
			historicalOpen: '',
			historicalClose: '',
			historicalHigh: '',
			historicalLow: '',
			historicalVolume: '',
			historicalAdjClose: '',
			values: '',
			firstCompany: '',
			selectedCompany: '',
			selectedInterval: '',
			intervalRange: '',
			clickCompanyName: '',
			clickCompanySymbol: '',
			isToggleOn: true,
			setOpen: false,
			modalOpen: false,
			isLoaded: false,
			isSearchClick: false,
			isOpenSearch: false,
			isOpenCompanyList: false,
			isSelectinterval: false,
			isGraphDisplay: false,
			isSelectHistorical: false,
			isIntervalValue: false,
			isIndicatorGraph: false,
			isComparedCompany: false
		};
		this.addCompanytoWatchlist = this.addCompanytoWatchlist.bind(this);
		this.getSearchValue = this.getSearchValue.bind(this);
		this.submitSearchValue = this.submitSearchValue.bind(this);
		this.getCompany = this.getCompany.bind(this);
		this.displaySelectedCompanyGraph = this.displaySelectedCompanyGraph.bind(this);
		this.openSearchbar = this.openSearchbar.bind(this);
		this.displayCompanyList = this.displayCompanyList.bind(this);
		this.logOut = this.logOut.bind(this);
	}

	componentDidMount() {
		this.getCompany();
		this.getDate();
		this.unsubscribe = this.ref.onSnapshot(this.getCompany);
	}

	/**get name or symbol of search company */
	getSearchValue(event) {
		this.setState({ value: event.target.value, searchValue: event.target.value });
	}

	/**validation of search button */
	submitSearchValue(event) {
		this.setState({ value: '', isLoaded: false });
		/**validation for search input */
		if (!this.state.value) {
			swal("Please, Enter value", "", "info");
		} else {
			console.log("name:", this.state.value);
			console.log("searchValue", this.state.searchValue);
			event.preventDefault();
			this.getApiData();
			this.setState({ value: '' });
		}
	}

	/**call add company function and get name and symbol of add company */
	addCompanytoWatchlist(data) {
		console.log('data: ', data);
		this.setState({ companySymbol: data['1. symbol'], companyName: data['2. name'] });
		this.getApiData();
		this.addComapny();
	}

	/**
	 * @param {*} companySymbol wise display historical data table 
	 */
	displayHistoricalData(companySymbol) {
		console.log("symbol of selected company==============>", companySymbol);
		this.setState({ isSelectHistorical: true, isSelectinterval: false, historicalArray: [], isComparedCompany: false })
		const url = config.getBaseUrl() + "TIME_SERIES_DAILY_ADJUSTED&symbol=" + companySymbol + config.getBaseUrlForKey();
		fetch(url)
			.then(res => res.json())
			.then(res => {
				const originalObject = res['Time Series (Daily)'];
				console.log('originalObject: ', originalObject);
				for (let key in originalObject) {
					this.state.historicalArray.push({
						date: key,
						open: originalObject[key]['1. open'],
						high: originalObject[key]['2. high'],
						low: originalObject[key]['3. low'],
						close: originalObject[key]['4. close'],
						adjclose: originalObject[key]['5. adjusted close'],
						volume: originalObject[key]['6. volume']
					})
				}
				console.log("historicalArray==========>", this.state.historicalArray);
				this.setState({ isSelectHistorical: true })
			}).catch((err) => { swal('internal server error'); })
	}

	/** selected symbol to add in watchlist */
	addComapny() {
		if (this.state.companySymbol) {
			console.log("addCompany2:", this.state.companySymbol);
			return (
				swal({
					title: this.state.companySymbol,
					text: this.state.companyName,
					icon: "success",
					dangerMode: true,
				}).then((willDelete) => {
					if (willDelete) {
						this.checkIfalreadyAddOrNot(this.state.companyName)
					} else {
						console.log("no data found");
					}
				})
			)
		}
	}

	/**
	 * @param {*} companyName already add or not 
	 */
	checkIfalreadyAddOrNot = (companyName) => {
		console.log('getcompany:');
		localStorage.getItem('email1')
		let email = localStorage.email1;
		console.log(companyName)
		let companyData = [];
		/**it's check selected company already added into database or not */
		firebase.firestore().collection("company").where("name", "==", companyName).where("email", "==", email)
			.get()
			.then(function (querySnapshot) {
				console.log("querySnapshot", querySnapshot)
				querySnapshot.forEach(function (doc) {
					const { name, email } = doc.data();
					console.log("data:", doc.data())
					companyData.push({
						key: doc.id,
						doc,
						name,
						email,
					});
				});
				console.log("data1:", companyData.length);
				if (companyData.length) {
					console.log('found data', companyData);
					swal("Already added!", "", "info")
						.then((willDelete) => {
							if (willDelete) {
								window.location.reload();
							}
						})
				} else {
					console.log("new company");
					addCompanyToDatabase()
				}
			});

		/**Add comapny to database */
		let addCompanyToDatabase = () => {
			localStorage.getItem('email1')
			let email = localStorage.email1;
			console.log("isLoaded before:", this.state.isLoaded);
			this.ref.add({
				symbol: this.state.companySymbol,
				name: this.state.companyName,
				email: email
			}).then((docRef) => {
				window.location.reload();
			})
				.catch((error) => {
					swal('internal server error');
				})
		}
	}

	/**api call for selected interval value */
	selectInterval = prop => event => {
		this.state.isSelectHistorical = false;
		var intervalApiData = [];
		console.log("event:", event.target.value);
		console.log("prop:", prop);
		console.log("interval array=========>", this.state.intervalArray);
		
		if (event.target.value === 'MONTHLY') {
			this.state.intervalArray = [];
			this.state.isComparedCompany = false;
			const url = config.getBaseUrl() + "TIME_SERIES_MONTHLY&symbol=" + prop + "&name=apple&interval=5min" + config.getBaseUrlForKey();
			fetch(url)
				.then(res => res.json())
				.then(res => {
					this.setState({ isIntervalValue: true, isSelectinterval: true, isSelectHistorical: false, isComparedCompany: false, selectedInterval: prop, graphData: [], isLoaded: true });
					const originalObject = res['Monthly Time Series'];
					console.log('originalObject: ', originalObject);
					console.log("interval array======second time===>", this.state.intervalArray);
					for (let key in originalObject) {
						intervalApiData.push({
							date: key,
							open: originalObject[key]['1. open'],
							high: originalObject[key]['2. high'],
							low: originalObject[key]['3. low'],
							close: originalObject[key]['4. close'],
							volume: originalObject[key]['5. volume']
						})
					}
					this.setState({ intervalArray: intervalApiData })
					this.displayGraphOfInterval();
				}).catch(err => swal('internal server error'))
		} else if (event.target.value === 'WEEKLY') {
			this.state.intervalArray = [];
			const url = config.getBaseUrl() + "TIME_SERIES_WEEKLY&symbol=" + prop + "&name=apple&interval=5min" + config.getBaseUrlForKey();
			fetch(url)
				.then(res => res.json())
				.then(res => {
					this.setState({ isIntervalValue: true, isSelectinterval: true, isSelectHistorical: false, isComparedCompany: false, selectedInterval: prop, graphData: [] });
					const originalObject = res['Weekly Time Series'];
					for (let key in originalObject) {
						intervalApiData.push({
							date: key,
							open: originalObject[key]['1. open'],
							high: originalObject[key]['2. high'],
							low: originalObject[key]['3. low'],
							close: originalObject[key]['4. close'],
							volume: originalObject[key]['5. volume']
						})
					} console.log("interval intervalArray", this.state.intervalArray);
					this.setState({ intervalArray: intervalApiData })
					this.displayGraphOfInterval();
				}).catch(err => swal('internal server error'))
		} else {
			this.state.intervalArray = [];
			const url = config.getBaseUrl() + "TIME_SERIES_INTRADAY&symbol=" + prop + "&name=apple&interval=" + event.target.value + config.getBaseUrlForKey();
			fetch(url)
				.then(res => res.json())
				.then(res => {
					this.setState({ isIntervalValue: true, isSelectinterval: true, isSelectHistorical: false, isComparedCompany: false, selectedInterval: prop, graphData: [] });
					const originalObject = res['Time Series (' + event.target.value + ')'];
					for (let key in originalObject) {
						intervalApiData.push({
							date: key,
							open: originalObject[key]['1. open'],
							high: originalObject[key]['2. high'],
							low: originalObject[key]['3. low'],
							close: originalObject[key]['4. close'],
							volume: originalObject[key]['5. volume']
						})
					} console.log("interval intervalArray", this.state.intervalArray);
					this.setState({ intervalArray: intervalApiData })
					this.displayGraphOfInterval();

				}).catch(err => swal('internal server error'))
		}
		this.setState({ isIntervalValue: true })
	};

	/**display graph of selected interval */
	displayGraphOfInterval() {
		console.log("inside function intervalArray=====>", this.state.intervalArray);
		let graphSeries = this.state.intervalArray;
		console.log("length of ========>:", graphSeries.length);
		let ts2 = 1484418600000;
		console.log("first intervalData----->", this.state.intervalData);
		this.state.intervalData = [];
		console.log("second time============>", this.state.intervalData);
		for (let i = 0; i < graphSeries.length; i++) {
			ts2 = ts2 + 86400000;
			let obj = JSON.parse(graphSeries[i].volume)
			let innerArr = [ts2, obj];
			this.state.intervalData.push(innerArr);
		}
		console.log("length--------------->", this.state.intervalData.length);
		console.log("intervalData ===========>:", this.state.intervalData);
		console.log("intervalArray ===========>:", this.state.intervalArray.length);

		let series = [{
			name: 'Stock price',
			type: 'area',
			data: this.state.intervalData
		}
		]
		console.log("before=========>", this.state.intervalData);
		var chartrender =
			<div id="chart">
				<ReactApexChart options={options} series={series} type="area" height="500" />
			</div>
		return (<div>
			{chartrender}
		</div>
		)
	}

	/**select company and call api of selected company */
	selectComparisonCompany = prop => event => {
		this.state.isComparedCompany = true;
		this.state.isSelectHistorical = false;
		this.state.isSelectinterval = false;
		this.state.isIndicatorGraph = false;
		this.state.isIntervalValue = false;
		console.log("companySymbol=============>", prop);
		console.log("event=================>", event.target.value);
		const url = config.getBaseUrl() + "TIME_SERIES_INTRADAY&symbol=" + event.target.value + "&name=apple&interval=5min" + config.getBaseUrlForKey();
		fetch(url)
			.then(res => res.json())
			.then(res => {
				this.setState({ isComparedCompany: true, firstCompany: prop, isIndicatorGraph: false, selectedCompany: event.target.value })
				const originalObject = res['Time Series (5min)'];
				console.log("res==========>", originalObject);
				for (let key in originalObject) {
					this.state.comparisonArray1.push({
						date: key,
						open: originalObject[key]['1. open'],
						high: originalObject[key]['2. high'],
						low: originalObject[key]['3. low'],
						close: originalObject[key]['4. close'],
						volume: originalObject[key]['5. volume']
					})
				}
				console.log("comparison Array1=======>", this.state.comparisonArray1);
				comparedCompanyData();
			}).catch(err => { swal('internal server error') })

		/**get data of other selected company data */	
		let comparedCompanyData = () => {
			var selectedCompany = [];
			const url1 = config.getBaseUrl() + "TIME_SERIES_INTRADAY&symbol=" + prop + "&name=apple&interval=5min" + config.getBaseUrlForKey();
			fetch(url1)
				.then(res1 => res1.json())
				.then(res1 => {
					console.log("res1============>", res1);
					if (res1.Note == 'Thank you for using Alpha Vantage! Our standard AP…would like to target a higher API call frequency.') {
						alert('wait 1 minute');
					} else {
						const originalObjectforDisplay = res1['Time Series (5min)'];
						console.log("originalObject===========>", originalObjectforDisplay);
						for (let key in originalObjectforDisplay) {
							selectedCompany.push({
								date: key,
								open: originalObjectforDisplay[key]['1. open'],
								high: originalObjectforDisplay[key]['2. high'],
								low: originalObjectforDisplay[key]['3. low'],
								close: originalObjectforDisplay[key]['4. close'],
								volume: originalObjectforDisplay[key]['5. volume']
							})
						}
						this.setState({ comparisonArray2: selectedCompany })
						console.log("comparison Array2=======>", this.state.comparisonArray2);
					}
					if (this.state.comparisonArray2.length && this.state.comparisonArray1.length) {
						this.displayGraphOfComparison();
					}
				}).catch(err => { swal('internal server error'); })
		}
		console.log("this.state.isComparedCompany:", this.state.isComparedCompany);
	}

	/**display table of both company*/
	displayGraphOfComparison() {
		if (this.state.comparisonArray1.length && this.state.comparisonArray2.length) {
			this.state.comparisonOfVolume = [];
			for (let i = 0; i < this.state.comparisonArray1.length; i++) {
				this.state.comparisonOfVolume.push({ date: this.state.comparisonArray1[i].date, diffrence: this.state.comparisonArray2[i].volume - this.state.comparisonArray1[i].volume, first: this.state.comparisonArray2[i].volume, second: this.state.comparisonArray1[i].volume });
			}
			return (
				<div>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Date</TableCell>
									<TableCell>{this.state.firstCompany}</TableCell>
									<TableCell>{this.state.selectedCompany}</TableCell>
									<TableCell>Differnce</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.comparisonOfVolume.map(data => (
									<TableRow key={data.diffrence}>
										<TableCell>{data.date}</TableCell>
										<TableCell>{data.first}</TableCell>
										<TableCell>{data.second}</TableCell>
										<TableCell>{data.diffrence}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</div>
			)
		}
	}

	/**select indicator and call API of selcted indicator */
	getSelectedIndicatorData = prop => event => {
		console.log("event:", event.target.value);
		console.log("prop:", prop);
		const url = config.getBaseUrl() + event.target.value + "&symbol=" + prop + "&interval=monthly&time_period=10&series_type=open" + config.getBaseUrlForKey();
		fetch(url)
			.then(res => res.json())
			.then(res => {
				this.setState({ indicatorGraphData: [], indicatorDataArray: [], isIndicatorGraph: true, isIntervalValue: false, isSelectHistorical: false, isComparedCompany: false })
				const originalObject = res['Technical Analysis: ' + [event.target.value]];
				console.log("result:", ['Technical Analysis: ' + [event.target.value]]);
				console.log("originalObject:", originalObject);
				console.log("isIndicatorGraph:", this.state.isIndicatorGraph);
				for (let key in originalObject) {
					this.state.indicatorDataArray.push({
						date: key,
						indicatorObj: originalObject[key][event.target.value],
					})
				}
				console.log("indicatorDataArray:", this.state.indicatorDataArray);
				this.displayGraphOfIndicator()
			}).catch(err => { swal('internal server error'); })
	}

	/**display graph of selected indicator */
	displayGraphOfIndicator() {
		console.log("indicator fun called");
		let graphSeries = this.state.indicatorDataArray;
		console.log("length:", graphSeries.length);
		let ts2 = 1484418600000;
		for (let i = 0; i < graphSeries.length; i++) {
			ts2 = ts2 + 86400000;
			let obj = JSON.parse(graphSeries[i].indicatorObj)
			let innerArr = [ts2, obj];
			this.state.indicatorGraphData.push(innerArr);
		}
		console.log("graphData:", this.state.indicatorGraphData);
		let options = {
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
				max: 250,
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
						return (val / 1000).toFixed(0)
					}
				}
			}
		}
		let series = [{
			name: 'Stock price',
			data: this.state.indicatorGraphData
		},
		]
		var chartrender =
			<div id="chart">
				<ReactApexChart options={options} series={series} type="area" height="500" />
			</div>
		return (<div>
			{chartrender}
		</div>
		)
	}

	/**display watchlist and graph or search list */
	displayCompanyList() {

		console.log("isIndicatorGraph:", this.state.isIndicatorGraph);
		console.log("isIntervalValue:", this.state.isIntervalValue);
		const { date } = this.state;

		const indicatorList = [
			{
				value: 'SMA',
				label: 'simple moving average (SMA)',
			},
			{
				value: 'EMA',
				label: ' Exponential moving average (EMA) '
			},
			{
				value: 'MACD',
				label: 'Moving average convergence / divergence (MACD)',
			},
			{
				value: 'MACDEXT',
				label: 'Moving average convergence / divergence'
			},
			{
				value: 'APO',
				label: 'Absolute price oscillator (APO)',
			},
			{
				value: 'RSI',
				label: 'Relative strength index (RSI)',
			},
			{
				value: 'ROC',
				label: ' Rate of change(ROC)'
			},
			{
				value: 'ROCR',
				label: 'Rate of change ratio (ROCR)'
			},
			{
				value: 'ADX',
				label: 'Average directional movement index (ADX) ',
			},
			{
				value: 'AROONOSC',
				label: ' Aroon oscillator (AROONOSC)'
			},
			{
				value: 'TRIX',
				label: 'Triple smooth exponential moving average (TRIX)',
			},
			{
				value: 'OBV',
				label: 'On balance volume (OBV) ',
			}
		];
		if (this.state.grapharray.length) {
			console.log('hey i m called');
			let graphSeries = this.state.grapharray;
			console.log("length:", graphSeries.length);
			let ts2 = 1484418600000;
			let graphData = [];
			for (let i = 0; i < graphSeries.length; i++) {
				ts2 = ts2 + 86400000;
				let obj = JSON.parse(graphSeries[i].volume)
				let innerArr = [ts2, obj];
				graphData.push(innerArr);
			}
			console.log("graphData:", graphData);
			let series = [{
				name: 'Stock price',
				data: graphData
			},
			]
			var chartrender =
				<div id="chart">
					<ReactApexChart options={options} series={series} type="area" height="450" />
					<span style={{ color: 'gray' }}>Open: </span> <span style={{ marginRight: 10 }}>{this.state.open}</span>
					<span style={{ color: 'gray' }}>Close: </span> <span style={{ marginRight: 10 }}>{this.state.close}</span>
					<span style={{ color: 'gray' }}>High: </span> <span style={{ marginRight: 10 }}>{this.state.high}</span>
					<span style={{ color: 'gray' }}>Low: </span> <span style={{ marginRight: 10 }}>{this.state.low}</span>
					<span style={{ color: 'gray' }}>Volume: </span> <span style={{ marginRight: 10 }}>{this.state.volume}</span>
				</div>
		}
		let showGraphOrSearchResult = this.state.searchResponse.length ? <div>
			<center><h3>Search Response....</h3></center>
			{this.state.searchResponse.map(data =>
				<List key={data['1. symbol']} className="list">
					<ListItem>
						<ListItemText className="search_list" primary={data['1. symbol']} secondary={data['2. name']} />
						<ListItemSecondaryAction className="search_list1">
							<IconButton color="primary" edge="end" aria-label="Delete" onClick={() => this.addCompanytoWatchlist(data)} className="addIcon">
								<AddIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				</List>
			)}
		</div> : (this.state.searchResponse ? <div>
			<span className="company_symbol">{this.state.clickCompanySymbol}</span><span style={{ color: 'gray' }}>{this.state.clickCompanyName}</span>
			{this.state.isGraphDisplay ? (<span>
				<span className="historical_data" style={{ padding: 10 }} onClick={() => this.displayHistoricalData(this.state.clickCompanySymbol)}>Historical Data</span>
				<TextField
					select
					style={{ float: 'right', padding: 10 }}
					value={this.state.values.intervalRange}
					onChange={this.selectInterval(this.state.clickCompanySymbol)}
					InputProps={{
						startAdornment: <InputAdornment position="start">Interval</InputAdornment>,
					}}
				>
					{ranges.map(option => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</TextField>
				<TextField
					select
					style={{ float: 'right', padding: 10 }}
					value={this.state.values.intervalRange}
					onChange={this.selectComparisonCompany(this.state.clickCompanySymbol)}
					InputProps={{
						startAdornment: <InputAdornment position="start">Comparison</InputAdornment>,
					}}
				>
					{this.state.companyData.map(company => (
						<MenuItem key={company.symbol} value={company.symbol}>
							{company.symbol}
						</MenuItem>
					))}
				</TextField>
				<TextField
					select
					style={{ float: 'right', padding: 10 }}
					value={this.state.values.intervalRange}
					onChange={this.getSelectedIndicatorData(this.state.clickCompanySymbol)}
					InputProps={{
						startAdornment: <InputAdornment position="start">Indicator</InputAdornment>,
					}}
				>
					{indicatorList.map(indicator => (
						<MenuItem key={indicator.value} value={indicator.value} >
							{indicator.label}
						</MenuItem>
					))}
				</TextField>

			</span>) : ('')}
			{this.state.isSelectHistorical ? (<div>
				<Paper>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell align="right">Open</TableCell>
								<TableCell align="right">High</TableCell>
								<TableCell align="right">Low</TableCell>
								<TableCell align="right">Close</TableCell>
								<TableCell align="right">Adj Close</TableCell>
								<TableCell align="right">Volume</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.historicalArray.map(historicalData => (
								<TableRow key={historicalData.date}>
									<TableCell component="th" scope="row">{historicalData.date}</TableCell>
									<TableCell align="right">{historicalData.open}</TableCell>
									<TableCell align="right">{historicalData.high}</TableCell>
									<TableCell align="right">{historicalData.low}</TableCell>
									<TableCell align="right">{historicalData.close}</TableCell>
									<TableCell align="right">{historicalData.adjclose}</TableCell>
									<TableCell align="right">{historicalData.volume}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>
			</div>) : (<div>{chartrender ? <div>{this.state.isIntervalValue ? <div>{this.displayGraphOfInterval()}</div> : <div>{this.state.isIndicatorGraph ? <div>{this.displayGraphOfIndicator()}</div> : <div>{this.state.isComparedCompany ? <div>{this.displayGraphOfComparison()}</div> : <div>{chartrender}</div>}</div>}</div>}</div>
				: <div></div>}</div>)}</div>
			: 'No data found')
		let displayCompany = this.state.companyData.length ? <div>{this.state.companyData.map(company =>
			<List key={company.key} className="cursorClass">
				<ListItem onClick={() => this.displaySelectedCompanyGraph(company)}>
					<ListItemText primary={company.symbol} secondary={company.name} />
					<ListItemSecondaryAction>
						<IconButton edge="end" aria-label="Delete" style={{ color: '#ff4d4d' }} onClick={this.deleteCompany.bind(this, company.key)}>
							<RemoveCircle />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
			</List>
		)} </div> : <div> <center><p>Add Comapany to watchlist</p></center></div>
		let displayData = this.state.companyData.length ? <div>{showGraphOrSearchResult}</div> : <div><center><h2>No Company Found</h2></center></div>
		/**when searchbar is open but not enter a value */
		if (this.state.isOpenSearch && !this.state.isSearchClick) {
			return (
				<div>
					<div className="grid_class">
						<span style={{ fontSize: 25, marginLeft: 8, color: '#fff' }}><b>Stock</b></span><br />
						<span style={{ fontSize: 17, color: 'gray', marginLeft: 8 }}>{date}</span>
						<div className="logout">
							<Link to="/login"><Button variant="contained" onClick={() => this.logOut()}>
								<b>Logout</b>
							</Button></Link>
						</div>
					</div>
					{this.addComapny()}
					<div className="grid_class1">
						<div className="company_list">
							<Grid container spacing={1}>
								<Grid item sm={10}>
									<p style={{ marginLeft: 18 }}>Manage WatchList</p>
								</Grid>
								<Grid item sm={2}>
									<p onClick={() => this.openCompanyList()} style={{ color: '#3f51b5', cursor: 'pointer' }}>Done</p>
								</Grid>
							</Grid>
							{this.state.companyData.map(company =>
								<List key={company.key} className="vl" >
									<ListItem >
										<ListItemText primary={company.symbol} secondary={company.name} />
										<ListItemSecondaryAction>
											<IconButton edge="end" aria-label="Delete" style={{ color: '#ff4d4d' }} onClick={this.deleteCompany.bind(this, company.key)}>
												<RemoveCircle />
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
									onChange={this.getSearchValue}
									margin="normal"
									variant="outlined"
								/>
								<Button id="search" onClick={this.submitSearchValue} style={{ color: '#fff' }} disabled={!this.state.value} autoFocus>
									Search
				</Button>
							</Typography>
						</div>
					</div>
				</div>
			)
			/**searchbar is open then it's return */
		} else if (this.state.isSearchClick) {
			if (!this.state.searchResponse.length) {
				console.log("========else if ========if======");
				return (
					<div>
						<div className="grid_class">
							<span style={{ fontSize: 25, marginLeft: 8, color: '#fff' }}><b>Stock</b></span><br />
							<span style={{ fontSize: 17, color: 'gray', marginLeft: 8 }}>{date}</span>
							<div className="logout">
								<Link to="/login"><Button variant="contained" onClick={() => this.logOut()}>
									<b>Logout</b>
								</Button></Link>
							</div>
						</div>

						{this.addComapny()}
						<div className="grid_class1">
							<div className="company_list">
								<Grid container spacing={12}>
									<Grid item sm={10}>
										<p style={{ marginLeft: 18 }}>Manage Watchlist</p>
									</Grid>
									<Grid item sm={2}>
										<p onClick={() => this.openCompanyList()} style={{ color: '#3f51b5' }}>Done</p>
									</Grid>
								</Grid>
								{this.state.companyData.map(company =>
									<List key={company.key} className="cursorClass vl">
										<ListItem onClick={() => this.displaySelectedCompanyGraph(company)}>
											<ListItemText primary={company.symbol} secondary={company.name} />
											<ListItemSecondaryAction>
												<IconButton edge="end" aria-label="Delete" style={{ color: '#ff4d4d' }} onClick={this.deleteCompany.bind(this, company.key)}>
													<RemoveCircle />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									</List>
								)}
							</div>
							<div className="searching_list">
								<center><div className="searchCompany_list">
									<p style={{ marginRight: 296 }}>Showing Results for: <span style={{ textTransform: 'capitalize' }}><b>{this.state.searchValue}</b></span></p>
									No Data Found
					          </div>
								</center>
							</div>
						</div>
					</div>
				)
			} else {
				console.log("else if =========else");
				return (
					<div>
						<div className="grid_class">
							<span style={{ fontSize: 25, marginLeft: 8, color: '#fff' }}><b>Stock</b></span><br />
							<span style={{ fontSize: 17, color: 'gray', marginLeft: 8 }}>{date}</span>
							<div className="logout">
								<Link to="/login"><Button variant="contained" onClick={() => this.logOut()}>
									<b>Logout</b>
								</Button></Link>
							</div>
						</div>
						{this.addComapny()}
						<div className="grid_class1">
							<div className="company_list">

								<Grid container spacing={1}>
									<Grid item sm={10}>
										<p style={{ marginLeft: 18 }}>Manage Watchlist</p>
									</Grid>
									<Grid item sm={2}>
										<p onClick={() => this.openCompanyList()} style={{ color: '#3f51b5', cursor: 'pointer' }}>Done</p>
									</Grid>
								</Grid>
								{this.state.companyData.map(company =>
									<List key={company.key} >
										<ListItem className="vl">
											<ListItemText primary={company.symbol} secondary={company.name} />
											<ListItemSecondaryAction>
												<IconButton edge="end" aria-label="Delete" style={{ color: '#ff4d4d' }} onClick={this.deleteCompany.bind(this, company.key)}>
													<RemoveCircle />
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
										onChange={this.getSearchValue}
										margin="normal"
										variant="outlined"
									/>
									<Button className="search_button" id="search" disabled={!this.state.value} onClick={this.submitSearchValue} style={{ color: '#fff' }} autoFocus>
										Search
									</Button>
								</Typography>

								<center><div className="searchCompany_list">
									<p style={{ marginRight: 296 }}>Showing Results for: <span style={{ textTransform: 'capitalize' }}><b>{this.state.searchValue}</b></span></p>

									{this.state.searchResponse.map(data =>
										<List key={data['1. symbol']} >
											<ListItem>
												<ListItemText primary={data['1. symbol']} secondary={data['2. name']} />
												<ListItemSecondaryAction >
													<IconButton color="primary" edge="end" aria-label="Delete" onClick={() => this.addCompanytoWatchlist(data)} >
														<AddIcon />
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

		} else {
			if (!this.state.isOpenCompanyList) {
				console.log("=====else ==========if");
				return (
					<div>
						<div className="grid_class">
							<span style={{ fontSize: 28, marginLeft: 8, color: '#fff' }}><b>Stock</b></span><br />
							<span style={{ fontSize: 17, color: 'gray', marginLeft: 8 }}>{date}</span>
							<div className="logout">
								<Link to="/login"><Button variant="contained" onClick={() => this.logOut()}>
									<b>Logout</b>
								</Button></Link>
							</div>
						</div>
						<div className="grid_class1">
							<div className="company_list">
								<div className="plus_class">
									<Grid container spacing={1}>
										<Grid item sm={4}>
											<IconButton color="primary" edge="end" aria-label="Delete" className="addIcon" onClick={() => this.openSearchbar()}>
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

	/**get data of searching company */
	getApiData() {
		console.log("value:", this.state.value);
		axios.get(config.getBaseUrl() + "SYMBOL_SEARCH&keywords=" + this.state.value + config.getBaseUrlForKey())
			.then((data) => {
				console.log("data of response:", data.data['bestMatches']);
				this.setState({
					searchResponse: data.data['bestMatches'],
					isSearchClick: true,
					isLoaded: true
				});
				if (!this.state.searchResponse.length) {
					console.log("searchrespone:", this.state.searchResponse.length);
					console.log("===if callling===");
					return (
						<div>
							"No Data Found"
					</div>
					)
				}
			}).catch(function (error) {
				swal('internal server error');
			});
	}

	/**get current date */
	getDate = () => {
		var date = new Date().toDateString();
		this.setState({ date });
	};

	/**
	 * @param {*} id wise delete company from watchlist 
	 */
	deleteCompany(id) {
		firebase.firestore().collection('company').doc(id).delete().then(() => {
			console.log("cdata:", this.state.companyData);
			swal("Successfully deleted!", "", "success");
			console.log("Document successfully deleted!");
			if (this.state.companyData.length === 1) {
				window.location.reload();
			}
		}).catch((error) => {
			swal('internal server error');
		});
	}

	/**
	 * @param {*} data wise display graph 
	 */
	displaySelectedCompanyGraph(data) {
		this.state.isSelectHistorical = false;
		this.state.isIndicatorGraph = false;
		this.state.isComparedCompany = false;
		this.state.isSelectinterval = false;
		this.state.isIntervalValue = false;
		this.setState({
			isLoaded: false, isSelectinterval: false, isSelectHistorical: false, isComparedCompany: false, isIndicatorGraph: false
		})
		console.log('data: ', data);
		let grapharray = [];
		const url = config.getBaseUrl() + "TIME_SERIES_INTRADAY&symbol=" + data.symbol + "&name=apple&interval=5min" + config.getBaseUrlForKey();
		fetch(url)
			.then(res => res.json())
			.then(res => { console.log(res); return res; if (res.Note == 'Thank you for using Alpha Vantage! Our standard AP…would like to target a higher API call frequency.') { console.log("hellooooooooooooooooooooooooooooooooo"); } })
			.then(res => {
				if (!res) {
					swal("Click after a minute");
				} else {
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
					if (!grapharray.length) {
						console.log("helloooooooooooooooooooooooooo");
						setTimeout(this.setState({ isLoaded: true }), 3000);
						swal('click after a minue')
					} else {
						console.log("open:", grapharray['0'].open);
						console.log("isGraphDisplay before======>", this.state.isGraphDisplay);
						this.setState({
							grapharray: grapharray,
							open: grapharray['0'].open,
							close: grapharray['0'].close,
							high: grapharray['0'].high,
							low: grapharray['0'].low,
							volume: grapharray['0'].volume,
							clickCompanyName: data.name,
							clickCompanySymbol: data.symbol,
							isLoaded: true,
							isGraphDisplay: true
						})
						console.log("isGraphDisplay after======>", this.state.isGraphDisplay);
					}
				}

			}).catch((error) => {
				swal('internal server error');
			});
	}

	/**logout and clear localstorage */
	logOut= () => {
		firebase
			.auth()
			.signOut().then(function () {
				// console.log("props==========>",this.props);
				// this.props.history.push("/")
				console.log('Signed Out');
				localStorage.getItem('email1');
				console.log(localStorage);
				localStorage.clear();
				localStorage.removeItem('email1');
				console.log(localStorage);
				window.location.hash = "/"
			}, function (error) {
				swal('internal server error');
			});
	}

	/**open searchbar onclick of plus sign */
	openSearchbar() {
		this.setState({
			isOpenSearch: true
		});
	}

	/**display watchlist onclick of done */
	openCompanyList() {
		this.setState({ isOpenCompanyList: false })
		console.log("isOpenCompanyList:", this.state.isOpenCompanyList);
		this.props.history.push("/Company-list")
		// window.location.hash = '/Company-list';
	}

	/**get current user added company from database */
	getCompany() {
		let companyData = [];
		localStorage.getItem('email1')
		let email = localStorage.email1;
		console.log('email==========>', email);
		firebase.firestore().collection("company").where("email", "==", email)
			.get()
			.then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
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
					console.log("call");
					displayGraph()
				} else {
					return (
						<div>
							<p>No data found</p>
						</div>
					)
				}
			}).catch(function (error) {
				console.log("Error getting documents: ", error);
			});

		var setLoader = (isLoaded) => {
			this.setState({
				isLoaded: isLoaded
			})
		}

		var setTheState = (companyData) => {
			this.setState({
				companyData: companyData,
				isLoaded: true
			})
		}
		var displayGraph = () => {
			console.log("companyData before:", this.state.companyData);
			console.log("companyData:", this.state.companyData);
			let firstCompanySymbol = this.state.companyData[0];
			console.log("firstCompanySymbol", firstCompanySymbol);
			this.displaySelectedCompanyGraph(firstCompanySymbol)
		}
	}

	render() {

		const { isLoaded } = this.state;

		if (!isLoaded) {
			return (
				<center>
					<div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
				</center>
			)
		} else if (isLoaded) {
			return (
				<div className="main">
					{this.displayCompanyList()}
				</div>
			)

		} else {
			return (
				<div>
					<h2>Sorry no data found</h2>
				</div>
			);
		}
	}

}


export default Companylist

