import CompanyPeet from "@/icons/company/CompanyPeet";
import { routeToSingIn } from "@/utils/route_builders/as_not_logged/RouteBuilderForAuth";
import Link from "next/link";

const HomeRedirector = ({ extraClasses = [] }: { extraClasses?: string[] }) => {
  return (
    <Link
      href={routeToSingIn()}
      className={"action-button | icon-wrapper bg margin-top-25".concat(
        extraClasses.reduce((acc, c) => acc + " " + c, ""),
      )}
    >
      <CompanyPeet />
      <span className="text | big-medium-v3 bold">
        Comienza <i className="text big-medium-v3 bold">Ahora!</i>
      </span>
    </Link>
  );
};

export default HomeRedirector;
