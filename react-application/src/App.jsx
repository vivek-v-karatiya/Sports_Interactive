import { useEffect, useRef, useState } from "react";
import "./Css/App.css";
import PlayerCard from "./Component/PlayerCard";
import { axiosGetApiHelper } from "./Helper/Api/AxiosHelper";
import { AlertError } from "./Global/Toaster/Alert";
import { ToastContainer } from "react-toastify";
import Loader from "./Component/GlobalComponent/Loader";

const App = () => {
	const [playerList, setPlayerList] = useState([]);
	const [filteredPlayerList, setFilteredPlayerList] = useState([]);
	const [playerFilterText, setPlayerFilterText] = useState("");
	const [loader, setLoader] = useState("d-none");
	const searchText = useRef("");

	useEffect(() => {
		callWileLoad();
	}, []);

	const dataCardArray = filteredPlayerList.map((dataObject, i) => {
		return <PlayerCard key={i} data={dataObject} />;
	});

	const callWileLoad = async () => {
		setLoader("d-block");
		try {
			const playerData = await axiosGetApiHelper(
				"https://api.npoint.io/20c1afef1661881ddc9c"
			);
			if (playerData?.status === 200) {
				if (playerData?.data?.playerList.length > 0) {
					let sortedArray = sortArrayAscending(
						playerData?.data?.playerList
					);
					setPlayerList(sortedArray);
					setFilteredPlayerList(sortedArray);
				} else {
					setPlayerList([]);
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
		if (searchData) {
			let newArray = playerList.filter(function (object) {
				return (
					object.TName.toLocaleUpperCase() === searchData ||
					object.PFName.toLocaleUpperCase() === searchData
				);
			});
			setFilteredPlayerList(newArray);
		} else {
			setFilteredPlayerList(playerList);
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
		CallDeBouncer();
	};

	const ClearFilter = () => {
		if (searchText.current) {
			setPlayerFilterText("");
			searchText.current = "";
			CallDeBouncer();
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
