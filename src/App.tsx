import React from "react";
import "./styles/index.less";
import {
	ApiRequest,
	TRIGGER_ID,
} from "@rocketman-system/streamkit-widget-helper";

const audio = new Audio(require('./media/photo.mp3').default);

export const App = React.memo(() => {
	const [loaded, setLoaded] = React.useState(false);
	const [data, setData] = React.useState<{
		/** ID of the effect these data belong to */
		effectId: string;
		/** Unique ID of this trigger */
		triggerId: string;
		/** How long to display the effect (in seconds) */
		seconds: number;
		/** Effect volume level (0-100) */
		volume: number;
		/** Name of the effect sender */
		name?: string;
		/** Message from the sender */
		message?: string;
		/** Donation amount (if donation)
		 * @example 100 USD
		 */
		amount?: string;
	}>();
	const [flash, setFlash] = React.useState(false);

    React.useEffect(() => {
      const tm = setTimeout(() => {
        setFlash(true);
      }, 1100);

      return () => {
        clearTimeout(tm);
      };
    }, []);

	React.useEffect(() => {
		ApiRequest("GET", "private/effect/loadData", {
			triggerId: TRIGGER_ID,
		}).then((data) => {
			setData(data);
			setLoaded(true);
		});
	}, []);

	React.useEffect(() => {
		if (!loaded || !data?.volume) return;
		audio.currentTime = 0;
		audio.play();
		audio.autoplay = true;
		audio.volume = data.volume / 100;

		audio.onended = () => {
			audio.currentTime = 8.13;
			audio.play();
		};


		return () => {
			audio.pause();
		};
	}, [loaded, data]);

	if (!loaded) return <></>;

	return (
      <>
        {!flash ? (
          <div className={`photo`}>
            <div className="container">
              <div className="camera-top">
                <div className="zoom"></div>
                <div className="mode-changer"></div>
                <div className="sides"></div>
                <div className="range-finder"></div>
                <div className="focus"></div>
                <div className="red"></div>
                <div className="view-finder"></div>
                <div className="flash">
                  <div className="light"></div>
                </div>
              </div>
              <div className="camera-mid">
                <div className="sensor"></div>
                <div className="lens"></div>
              </div>
              <div className="camera-bottom"></div>
            </div>
          </div>
        ) : (
          <div className="photoFlash"></div>
        )}
      </>
    );
});
