import { KmlDataSource } from "resium";

const KmlDataSourceLazy = () => {
  return <KmlDataSource data={"/plate-boundaries.kmz"} />;
};

export default KmlDataSourceLazy;
