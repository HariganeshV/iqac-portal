import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import HodLayout from "../../layouts/HodLayout";
import AnalyticsBarChart from "../../components/charts/BarChart";
import HodSummaryCards from "../../components/dashboard/HodSummaryCards";

import {
    getHodAnalytics
} from "../../api/analyticsApi";

function HodAnalytics() {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [selectedQuarter, setSelectedQuarter] =
        useState("Q1");

    useEffect(() => {

        loadAnalytics();

    }, []);

    const loadAnalytics = async () => {

        try {

            const res =
                await getHodAnalytics();

            console.log("FULL RESPONSE:", res.data);

            setData(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    const selectedQuarterData =
        useMemo(() => {

            return (
                data?.chartData?.find(
                    (q) =>
                        q.quarter ===
                        selectedQuarter
                ) || null
            );

        }, [data, selectedQuarter]);

    if (loading) {

        return (

            <HodLayout>

                <div
                    style={{
                        padding: "30px"
                    }}
                >

                    <h2>
                        Loading Analytics...
                    </h2>

                </div>

            </HodLayout>

        );

    }

    return (

        <HodLayout>

            <div
                style={{
                    padding: "30px",
                    background: "#f3f4f6",
                    minHeight: "100vh"
                }}
            >

                <h1
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    📊 HOD Analytics
                </h1>

                <hr
                    style={{
                        marginBottom: "30px"
                    }}
                />

                {/* Quarter Selector */}

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "30px",
                        flexWrap: "wrap"
                    }}
                >

                    {

                        ["Q1", "Q2", "Q3", "Q4"].map(

                            (quarter) => (

                                <button

                                    key={quarter}

                                    onClick={() =>
                                        setSelectedQuarter(
                                            quarter
                                        )
                                    }

                                    style={{

                                        padding:
                                            "12px 28px",

                                        border: "none",

                                        borderRadius:
                                            "10px",

                                        cursor: "pointer",

                                        fontSize: "16px",

                                        fontWeight:
                                            "bold",

                                        background:

                                            selectedQuarter ===
                                            quarter

                                                ? "#2563eb"

                                                : "#e5e7eb",

                                        color:

                                            selectedQuarter ===
                                            quarter

                                                ? "#fff"

                                                : "#111827"

                                    }}

                                >

                                    {quarter}

                                </button>

                            )

                        )

                    }

                </div>

                {/* Current Quarter */}

                <div
                    style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "12px",
                        marginBottom: "30px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,.08)"
                    }}
                >

                    <h2>

                        {selectedQuarter}

                        {" "}

                        Analytics

                    </h2>

                    <p>

                        Submitted :

                        {" "}

                        {

                            selectedQuarterData?.submitted || 0

                        }

                    </p>

                    <p>

                        Pending :

                        {" "}

                        {

                            selectedQuarterData?.pending || 0

                        }

                    </p>

                    <p>

                        Approved :

                        {" "}

                        {

                            selectedQuarterData?.approved || 0

                        }

                    </p>

                    <p>

                        Rejected :

                        {" "}

                        {

                            selectedQuarterData?.rejected || 0

                        }

                    </p>

                    <p>

                        Not Submitted :

                        {" "}

                        {

                            selectedQuarterData?.notSubmitted || 0

                        }

                    </p>

                </div>

                {/* Summary */}

                <HodSummaryCards
                    summary={data?.summary}
                />

                {/* Chart */}

                <AnalyticsBarChart
                    data={data?.chartData || []}
                />

                {/* Faculty */}

                <div
                    style={{
                        background: "#fff",
                        borderRadius: "15px",
                        padding: "25px",
                        marginTop: "35px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,.08)"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "20px"
                        }}
                    >
                        Faculty List
                    </h2>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse"
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    background:
                                        "#2563eb",
                                    color: "#fff"
                                }}
                            >

                                <th
                                    style={{
                                        padding:
                                            "12px"
                                    }}
                                >
                                    Faculty Name
                                </th>

                                <th
                                    style={{
                                        padding:
                                            "12px"
                                    }}
                                >
                                    Email
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                data?.facultyList?.map(

                                    (faculty) => (

                                        <tr
                                            key={
                                                faculty._id
                                            }
                                        >

                                            <td
                                                style={{
                                                    padding:
                                                        "12px",
                                                    borderBottom:
                                                        "1px solid #e5e7eb"
                                                }}
                                            >

                                                {
                                                    faculty.name
                                                }

                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "12px",
                                                    borderBottom:
                                                        "1px solid #e5e7eb"
                                                }}
                                            >

                                                {
                                                    faculty.email
                                                }

                                            </td>

                                        </tr>

                                    )

                                )

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </HodLayout>

    );

}

export default HodAnalytics;