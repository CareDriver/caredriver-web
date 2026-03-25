"use client";

import React, { useEffect, useState } from "react";
import { Enterprise } from "@/interfaces/Enterprise";
import { getUserEnterprises } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import SimpleEnterpriseCard from "../cards/SimpleEnterpriseCard";
import "@/styles/components/pagination.css";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceType } from "@/interfaces/Services";
import { routeToManageEnterpriseAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";
import UserTie from "@/icons/UserTie";

interface Props {
  user: UserInterface;
  typeOfEnterprise: ServiceType;
}

const EnterpriseListForUserServer: React.FC<Props> = ({
  user,
  typeOfEnterprise,
}) => {
  const [data, setData] = useState<Enterprise[] | null>(null);

  useEffect(() => {
    if (user.id) {
      getUserEnterprises(typeOfEnterprise, user.id).then((result) => {
        setData(result);
      });
    }
  }, [typeOfEnterprise, user.id]);

  if (!data) {
    return (
      <div className="auto-height">
        <span className="loader-green | big-loader"></span>
      </div>
    );
  }

  if (data.length <= 0) {
    return null;
  }

  return (
    <>
      <h2 className="text | medium-big bold | icon-wrapper margin-bottom-10">
        <UserTie />
        Tus empresas
      </h2>
      <div className="enterprise-list">
        {data.map(
          (enterprise, i) =>
            enterprise.id && (
              <SimpleEnterpriseCard
                key={`enterprise-item-${i}`}
                route={routeToManageEnterpriseAsUser(
                  enterprise.type,
                  enterprise.id,
                )}
                enterprise={enterprise}
              />
            ),
        )}
      </div>
    </>
  );
};

export default EnterpriseListForUserServer;
