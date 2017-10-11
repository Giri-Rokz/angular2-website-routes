import React, { Component }  from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export class RainContainer extends React.Component {
	constructor() {
			{/*used for initializing state and binding events. Will be loaded only when comp is mounted for the first time*/}
			super();
			{/*need to have super if constructor is used -> to access this*/}
			{/*super(props); -> When you want to access this.props in constructor*/}
		{/*lifecycle hooks: (Mounting) : componentWillMount -> render -> componentDidMount
		(updating state) : shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate for props: componentWillReceiveProps is extra*/}
		
		this.state = {
			value: 'Please select..',
			data: {},
			tomoro: "",
			dayAfter: "",
			today: "",
			daily: "",
			currently: "",
			tomorrow: "",
			options: [{
				value: "0",
				text: "Please select.."
			}, {
				value: "CHN",
				text: "Chennai"
			},{
				value: "KOL",
				text: "Kolkata"
			},{
				value: "LON",
				text: "London"
			},{
				value: "MEL",
				text: "Melbourne"
			},{
				value: "PAR",
				text: "Paris"
			}]
		}		
	}

shouldComponentUpdate(nextProps, nextState){
    if(this.state.value !== nextState.value) {
		return true;
	}
}
componentDidMount() {	
	this.fetchResp();
}
fetchResp(city,text) {
	let scope = this;	
	let respObj = {};	
	let position; 
	position = city === "CHN" ? "13.0827,80.2707" : city === "PAR" ? "48.8566,2.3522" : city === "NYC" ? "40.7128,74.0059" : city === "LON" ? "51.5074,0.1278" : city === "MEL" ? "37.8136,144.9631" : city === "KOL" ? "22.5726,88.3639" : "13.0827,80.2707";	
	fetch('https://api.darksky.net/forecast/0d705f15ac73a154910d033d798a1847/'+position+'?exclude=flags&units=ca')
	.then(function (data) {
	data.json().then(function (resp) {
		if(resp) {
			respObj = resp;				
			scope.updateState(respObj,city);
		}		
	})
	}).catch(function (error) {
		alert('Network is down');
		console.log('request failed');
	})
}
updateState(respObj,val) {
	this.setState({
		data: respObj,
		value: val,
		tomoro: {
			tempMin: respObj.daily.data[0].temperatureMin,
			tempMax: respObj.daily.data[0].temperatureMax,
			humidity: respObj.daily.data[0].humidity,
			wind: respObj.daily.data[0].windSpeed
		},
		dayAfter: {
			tempMin: respObj.daily.data[1].temperatureMin,
			tempMax: respObj.daily.data[1].temperatureMax,
			humidity: respObj.daily.data[1].humidity,
			wind: respObj.daily.data[1].windSpeed
		},
		daily: respObj.daily,
		today: new Date().getDay() + 1,
		tomorrow: new Date().getDay() + 2,
	});	
}
	
render() {
	return(<div>
			<Header/>
			<div id="subContainer clearfix">
				<SubHeader val={this.state.value} updateState={this.updateState.bind(this)} parentMet={this.fetchResp.bind(this)} opt = {this.state.options} resp={this.state.data}/>
			</div>
			<div id="dataContainer">
				 <Leftpane today={this.state.data}/>
				 <Rightpane obj={this.state}/>
			</div>
		</div>);
	}
}
{/*Stateless component - can't store anything. No lifecycle hooks. Can use proptypes & defaultprops. Used just for rendering*/}
const Header = (props) => {
	return(<header>
			<div id="clock"></div>
			<span className="col-md-12 col-sm-4">RAiNY DAY</span>
		</header>);
}
Header.proptypes = {
	props: PropTypes.object
}

class SubHeader extends React.Component {
	constructor() {
		super();
		this.changeCity = this.changeCity.bind(this);
	}	
	shouldComponentUpdate(nextProps, nextState){
		if(this.props.val !== nextProps.val) {
			return true;
		}
	}
	changeCity(e) {		
		let val = e.target.value;		
		let text = e.target.options[e.target.selectedIndex].text;
		this.props.parentMet(val,text);
	}	
	render() {
		return(<div>
				<div className="height30 col-md-3 col-sm-1 padding">Time Zone :<span>{this.props.resp.timezone}</span></div>				
				<div className="form-group margin2">
				  <label htmlFor="sel1">Select a city :</label>
				  <select className="form-control" value={this.props.val} onChange={this.changeCity} id="cities">{this.props.opt.map((data,x) =>  <option key={x} value={data.value}>{data.text}</option>)}			
				  </select>
				</div>
			</div>);
	}
}
SubHeader.propTypes = {
  val: PropTypes.string.isRequired
};
class Leftpane extends React.Component {
	render() {	
		return(<div>
				<div className="left-pane col-lg-5 col-md-5 col-sm-2">
				<div className="rightNow clearfix"><span className="cyan">RIGHT NOW</span>
				{typeof this.props.today.hourly !== "undefined" && 
					<div><span className={"icon-"+this.props.today.hourly.icon}></span>
					<span className="summary">
						<span className="block">Today's weather : {this.props.today.hourly.summary} </span>
						<span className="">Currently : {this.props.today.currently.summary} </span>
					</span></div>
				}
				<div className="padding">Next hour:  C</div>
				<div className="weatherNow clearfix">
				{typeof this.props.today.currently !== "undefined" &&
					<div className="col-md-12 col-lg-12 col-sm-2">
						<div className="padding">Temperature :<span>{this.props.today.currently.apparentTemperature} C</span></div>
						<div className="padding">Humidity :<span>{this.props.today.currently.humidity}</span></div>
						<div className="padding">Wind Speed :<span>{this.props.today.currently.windSpeed} km/h</span></div>
						<div className="padding">Cloud Cover :<span>{this.props.today.currently.cloudCover}</span></div>
						<div className="padding">Visibility :<span>{this.props.today.currently.visibility} km</span></div>
						<div className="padding">Precipitation Intensity :<span>{this.props.today.currently.precipIntensity} mm/h</span></div>
					</div>
				}
				</div>
				</div>
				</div>
			</div>)	 
	}	
}
class Rightpane extends React.Component {
	render() {		
		return(<div>
				{typeof this.props.obj.daily.data !== "undefined" && 
					<div className="right-pane col-lg-6 col-md-6 col-sm-2">
						<div className="tomoro col-lg-12 col-md-12 col-sm-4">
							<GetDay day={this.props.obj.today}/>
							<Icon pic={this.props.obj.daily.data[0].icon} sum={this.props.obj.daily.data[0].summary}/>
							<FutureWeather resp={this.props.obj.tomoro}/>
						</div>
						<div className="dayAfterTomoro col-lg-12 col-md-12 col-sm-4">
							<GetDay day={this.props.obj.tomorrow}/>
							<Icon pic={this.props.obj.daily.data[1].icon} sum={this.props.obj.daily.data[1].summary}/>
							<FutureWeather resp={this.props.obj.dayAfter}/>
						</div>
					</div>
				}
			</div>)
	}
}
class GetDay extends React.Component {
	render() {
		let futureDay;
		if(this.props.day) {			
			futureDay = this.props.day === 0 || this.props.day === 7 ? "SUNDAY" : this.props.day === 1 ? "MONDAY" : this.props.day === 2 ? "TUESDAY" : this.props.day === 3 ? "WEDNESDAY" : this.props.day === 4 ? "THURSDAY" : this.props.day === 5 ? "FRIDAY" : "SATURDAY";				
		}
		return(<div>
				<span className="cyan">{futureDay}</span>
			</div>);
	}
}
class Icon extends React.Component {
	render(){
		return(<div>
			{typeof this.props.pic !== "undefined" && 
				<div className="padding clearfix">
					<span className={"icon-"+this.props.pic}></span>
					<span className="summary">
						<span className="block">Weather : {this.props.sum}</span>
					</span>
				</div>
			}
		</div>)		
	}
}
class FutureWeather extends React.Component {
	render() {		
			return(<div>
			{typeof this.props.resp !== "undefined" && 	
				<div className="weatherFuture">
					<div className="col-md-5 col-sm-1">
						<div className="padding">Max Temperature :{this.props.resp.tempMax} <span> C</span></div>
						<div className="padding">Min Temperature : {this.props.resp.tempMin}<span> C</span></div>
					</div>
					<div className="col-md-5 col-sm-1">
						<div className="padding">Humidity : {this.props.resp.humidity}<span> </span></div>
						<div className="padding">Wind Speed : {this.props.resp.wind}<span> km/h</span></div>
					</div>
				</div>
			}
		</div>)			
	}	
}
export default RainContainer;