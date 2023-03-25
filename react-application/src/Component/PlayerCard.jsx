import { memo } from "react";
import { LocalTime } from "../Global/DateAndTime/Moment";

const imageExists = require("image-exists");

const PlayerCard = (props) => {
	let playerCardData = props.data;
	let upcomingMatch = "--";
	let matchTime =
		playerCardData?.UpComingMatchesList[0]?.MDate === ""
			? "--"
			: LocalTime(playerCardData?.UpComingMatchesList[0]?.MDate);
	if (
		playerCardData?.UpComingMatchesList[0]?.CCode !== "" &&
		playerCardData?.UpComingMatchesList[0]?.VsCCode !== ""
	) {
		upcomingMatch = `${
			playerCardData.UpComingMatchesList[0].CCode === ""
				? ""
				: playerCardData.UpComingMatchesList[0].CCode
		} VS ${playerCardData.UpComingMatchesList[0].VsCCode}`;
	}

	let playerImageSourcePath = `/player-images/${playerCardData.Id}.jpg`;

	imageExists(playerImageSourcePath, function (exists) {
		if (!exists) {
			playerImageSourcePath = `/player-images/optional.png`;
		}
	});

	return (
		<div className="col-lg-4 col-md-6 col-sm-12">
			<div className="template__container">
				<div className="template__card">
					<img
						src={playerImageSourcePath}
						className="card__image"
						alt="PlayerImage"
					/>
					<p className="player__name">{playerCardData.PFName}</p>
					<p className="player__skill">{playerCardData.SkillDesc}</p>
					<p className="player__value">
						Value: $ {playerCardData.Value}
					</p>
					<hr className="horizontal__row" />
					<p className="upcoming__match">Upcoming Match</p>
					<p className="upcoming__match__data"> {upcomingMatch}</p>
					<p className="upcoming__match__time">{matchTime}</p>
				</div>
			</div>
		</div>
	);
};

export default memo(PlayerCard);
