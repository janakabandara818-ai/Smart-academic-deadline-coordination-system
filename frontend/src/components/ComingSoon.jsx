import { Link } from "react-router-dom";
import { PageHeading } from "./UI";

export default function ComingSoon({ feature }) {
  return (
    <>
      <PageHeading
        title={`${feature} – Coming Soon`}
        description="This feature is currently under development and will be available in an upcoming sprint."
      />
      <Link to="/" className="button primary">
        Back to Dashboard
      </Link>
    </>
  );
}
