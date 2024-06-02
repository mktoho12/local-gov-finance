"use client"

import { GoogleMap, useLoadScript } from "@react-google-maps/api"

export default function Home() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  })

  const onLoad = (map: google.maps.Map) => {
    console.log("map: ", map)
    map.setCenter({
      lat: 35.6895,
      lng: 139.6917, // 東京の座標)
    })
    map.setZoom(8)

    map.data.loadGeoJson("/geojson2.json")

    map.data.setStyle(function (feature) {
      var annualBalance = feature.getProperty("annual_balance")
      var color = getColor(annualBalance)
      return {
        fillColor: color,
        strokeWeight: 1,
      }
    })

    const infowindow = new google.maps.InfoWindow()

    map.data.addListener(
      "click",
      function (event: google.maps.MapsEventListener) {
        var feature = event.feature
        var name =
          feature.getProperty("N03_001") +
          (feature.getProperty("N03_003") ?? "") +
          (feature.getProperty("N03_004") ?? "")
        var annualBalance = parseInt(feature.getProperty("annual_balance"))
        var content = annualBalance
          ? `<div class="text-black"><strong>${name}</strong><br>実質単年度収支: ${
              annualBalance > 0 ? "+" : annualBalance < 0 ? "" : "±"
            }${annualBalance.toLocaleString()}千円</div>`
          : "不明"

        infowindow.setContent(content)
        infowindow.setPosition(event.latLng)
        infowindow.open(map)
      }
    )

    function getColor(annualBalance) {
      return annualBalance > 1000000
        ? "#FF4000"
        : annualBalance > 750000
        ? "#FF8000"
        : annualBalance > 500000
        ? "#FFBF00"
        : annualBalance > 250000
        ? "#FFFF00"
        : annualBalance > 0
        ? "#00FFFF"
        : annualBalance > -250000
        ? "#00BFFF"
        : annualBalance > -500000
        ? "#007FFF"
        : annualBalance > -750000
        ? "#0040FF"
        : annualBalance > -1000000
        ? "#0000FF"
        : "#000000"
    }
  }

  return (
    <>
      <main className="min-h-screen">
        <h2 className="text-2xl font-medium text-center my-4">
          令和4年度 実質単年度収支マップ
        </h2>
        <div className="flex justify-center gap-4">
          {isLoaded ? (
            <GoogleMap
              options={{}}
              onLoad={onLoad}
              mapContainerClassName="w-9/12 h-[600px]"
            />
          ) : (
            <div className="w-9/12 h-[600px] grid place-items-center">
              Loading...
            </div>
          )}
          <div className="w-48 text-white">
            <div className="w-50 py-2 px-4 text-xs bg-[#FF4000]">
              プラス10億円以上
            </div>
            <div className="w-50 py-2 px-4 text-xs bg-[#FF8000]">
              プラス7.5億円以上
            </div>
            <div className="w-50 py-2 px-4 text-xs bg-[#FFBF00]">
              プラス5億円以上
            </div>
            <div className="w-50 py-2 px-4 text-xs bg-[#FFFF00] text-black">
              プラス2.5億円以上
            </div>
            <div className="w-50 py-2 px-4 text-xs bg-[#00FFFF] text-black">
              マイナスじゃない
            </div>
            <div className="w-50 py-2 px-4 text-xs bg-[#00BFFF] text-black">
              マイナス2.5億円以上
            </div>
            <div className="w-50 py-2 px-4 text-xs bg-[#007FFF]">
              マイナス5億円以上
            </div>
            <div className="w-50 py-2 px-4 text-xs bg-[#0040FF]">
              マイナス7.5億円以上
            </div>
            <div className="w-50 py-2 px-4 text-xs bg-[#0000FF]">
              マイナス10億円以上
            </div>
            <div className="w-50 py-2 px-4 text-xs bg-[#000000]">それ以下</div>
          </div>
        </div>
      </main>
    </>
  )
}
