import {
  YMaps,
  Map,
  ObjectManager,
} from "@pbe/react-yandex-maps";
import { useState, useEffect } from "react";

const ObjectActive = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(data);
    setData(props.data);
  }, [props.data]);

  return (
  <>
    {data.length === 0 ?
        <div className="text-black font-semibold">Нет действующих лицензий</div>
    :
        null
    }
    <YMaps>
      <div className="h-screen w-full rounded-md">
        <Map
          style={{ height: "100%", width: "100%" }}
          defaultState={{ center: [55.751574, 37.573856], zoom: 9 }}
        >
          <ObjectManager
            options={{
              clusterize: true,
              gridSize: 32,
            }}
            objects={{
              openBalloonOnClick: true,
              preset: "islands#blueDotIcon",
            }}
            clusters={{
              preset: "islands#redClusterIcons",
            }}
            defaultFeatures={data}
            modules={[
              "objectManager.addon.objectsBalloon",
              "objectManager.addon.objectsHint",
            ]}
          />
        </Map>
      </div>
    </YMaps>
  </>
  );
};

export default ObjectActive;
