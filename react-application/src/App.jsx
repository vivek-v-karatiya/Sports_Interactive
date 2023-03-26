import { useEffect, useRef, useState } from "react";
import "./Css/App.css";
import PlayerCard from "./Component/PlayerCard";
import { axiosGetApiHelper } from "./Helper/Api/AxiosHelper";
import { AlertError } from "./Global/Toaster/Alert";
import { ToastContainer } from "react-toastify";
import Loader from "./Component/GlobalComponent/Loader";
import { ApiList } from "./ApiEndPoints";

const App = () => {
	const [filteredPlayerList, setFilteredPlayerList] = useState([]);
	const [playerFilterText, setPlayerFilterText] = useState("");
	const [loader, setLoader] = useState("d-none");
	const clearButtonElement = useRef();
	const searchText = useRef("");
	const playerList = useRef([]);

	useEffect(() => {
		callWileLoad();
	}, []);

	const dataCardArray = filteredPlayerList.map((dataObject, i) => {
		return <PlayerCard key={i} data={dataObject} />;
	});

	const callWileLoad = async () => {
		clearButtonElement.current.setAttribute("disabled", true);
		setLoader("d-block");
		try {
			const playerData = await axiosGetApiHelper(ApiList().getPlayerList);
			if (playerData?.status === 200) {
				if (playerData?.data?.playerList.length > 0) {
					let sortedArray = sortArrayAscending(
						playerData?.data?.playerList
					);
					playerList.current = sortedArray;
					setFilteredPlayerList(sortedArray);
				} else {
					playerList.current = [];
					setFilteredPlayerList([]);
				}
			} else {
				AlertError("Internal server error..!");
			}
		} catch (error) {
			AlertError("Something went wrong..!");
		}
		setLoader("d-none");
	};

	const sortArrayAscending = (array) => {
		return array.sort((p1, p2) =>
			parseFloat(p1.Value) < parseFloat(p2.Value)
				? -1
				: parseFloat(p1.Value) > parseFloat(p2.Value)
				? 1
				: 0
		);
	};

	const FilterData = () => {
		const searchData = searchText.current.toLocaleUpperCase();
		const playerData = playerList.current;
		if (searchData) {
			clearButtonElement.current.removeAttribute("disabled");
			let newArray = playerData.filter(function (object) {
				return (
					object.TName.toLocaleUpperCase() === searchData ||
					object.PFName.toLocaleUpperCase() === searchData
				);
			});
			setFilteredPlayerList(newArray);
		} else {
			clearButtonElement.current.setAttribute("disabled", true);
			setFilteredPlayerList(playerData);
		}
	};

	//#region Debounce Function Call While User Typing
	const DeBouncer = (func, delay) => {
		let timer;
		return function () {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				func();
			}, delay);
		};
	};
	//#endregion

	const CallDeBouncer = DeBouncer(FilterData, 500);

	const FilterTextChange = (e) => {
		setPlayerFilterText(e.target.value);
		searchText.current = e.target.value;
		if (e.target.value) {
			CallDeBouncer();
		} else {
			clearButtonElement.current.setAttribute("disabled", true);
			setFilteredPlayerList(playerList.current);
		}
	};

	const ClearFilter = () => {
		if (searchText.current) {
			setFilteredPlayerList(playerList.current);
			setPlayerFilterText("");
			searchText.current = "";
			clearButtonElement.current.setAttribute("disabled", true);
		}
	};

	return (
		<div>
			<div className="header__search">
				<div className="search-local">
					<div className="icon">
						<ion-icon name="search-outline"></ion-icon>
					</div>
					<input
						type="text"
						placeholder="Search by player name or player team"
						value={playerFilterText}
						name="filter"
						onChange={(e) => FilterTextChange(e)}
					/>
					<button
						onClick={() => {
							ClearFilter("");
						}}
						ref={clearButtonElement}
					>
						Clear
					</button>
				</div>
			</div>
			<div className="container">
				<div className="row">{dataCardArray}</div>
			</div>
			<div className={`${loader}`}>
				<Loader></Loader>
			</div>
			<ToastContainer />
		</div>
	);
};

export default App;
