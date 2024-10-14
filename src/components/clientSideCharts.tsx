"use client";

import dynamic from "next/dynamic";
import { ComponentType, PropsWithChildren } from "react";

const ClientSideChart = dynamic(() => import("./Chart"), { ssr: false });

export default ClientSideChart;
