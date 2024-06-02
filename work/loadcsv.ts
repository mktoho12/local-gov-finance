import parse from "csv-simple-parser"
import geo from "../public/geojson.json"

const main = async () => {
  const foo = Bun.file("public/a0010202261020100.csv")
  console.log(foo.size) // number of bytes
  console.log(foo.type) // MIME type

  const csv = parse(await foo.text(), { header: true })
  const values = csv
    .filter((row) => row["県名"] && row["行番号"] === "1")
    .reduce(
      (acc: Record<string, number>, row) => ({
        ...acc,
        [`${row["県名"]}/${row["団体名"]}`]: parseInt(
          row["010:実質単年度収支"]
        ),
      }),
      {}
    )

  const geo2 = {
    ...geo,
    features: geo.features.map((f) => {
      const key = `${f.properties["N03_001"]}/${f.properties["N03_004"]}`
      const key2 = `${f.properties["N03_001"]}/${f.properties["N03_003"]}` // 政令指定都市
      return {
        ...f,
        properties: {
          ...f.properties,
          annual_balance: values[key] ?? values[key2],
        },
      }
    }),
  }

  await Bun.write("public/geojson2.json", JSON.stringify(geo2, null, 2))
}

main().then(() => console.log("done"))
