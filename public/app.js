
// ======================================================
// COLD CHAIN DASHBOARD
// Fetch dữ liệu từ NestJS API
// ======================================================


// ======================================================
// API CONFIG
// ======================================================

// Nếu NestJS chạy:
// http://localhost:3000

const API_BASE_URL = "http://localhost:3000";


// Các endpoint backend
const API = {

    warehouse: `${API_BASE_URL}/warehouse`,

    vehicle: `${API_BASE_URL}/delivery-vehicle`,

    device: `${API_BASE_URL}/device`,

    data: `${API_BASE_URL}/data`

};


// ======================================================
// KHỞI TẠO
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    loadWarehouses();

    loadVehicles();

    loadDevices();

    loadSensorData();

    updateTime();

    setInterval(updateTime, 1000);

});


// ======================================================
// CHUYỂN PAGE
// ======================================================

const menuItems =
    document.querySelectorAll(".menu-item");


menuItems.forEach(item => {

    item.addEventListener("click", function () {

        const pageName =
            this.dataset.page;

        showPage(pageName);

    });

});


function showPage(pageName) {

    // Ẩn tất cả page

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active-page");

        });


    // Hiển thị page

    const selectedPage =
        document.getElementById(pageName);

    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    // Active menu

    menuItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageName) {

            item.classList.add("active");

        }

    });


    updatePageHeader(pageName);

}


// ======================================================
// HEADER
// ======================================================

function updatePageHeader(pageName) {

    const title =
        document.getElementById("page-title");

    const description =
        document.getElementById("page-description");


    const pages = {

        dashboard: {
            title: "Dashboard",
            description:
                "Tổng quan hệ thống giám sát chuỗi lạnh"
        },

        warehouses: {
            title: "Tra cứu kho",
            description:
                "Danh sách các kho trong hệ thống"
        },

        vehicles: {
            title: "Tra cứu xe",
            description:
                "Danh sách phương tiện vận chuyển"
        },

        devices: {
            title: "Tra cứu thiết bị",
            description:
                "Danh sách thiết bị IoT"
        },

        "sensor-data": {
            title: "Dữ liệu cảm biến",
            description:
                "Dữ liệu nhiệt độ và độ ẩm"
        }

    };


    if (pages[pageName]) {

        title.textContent =
            pages[pageName].title;

        description.textContent =
            pages[pageName].description;

    }

}


// ======================================================
// 1. LOAD WAREHOUSE
// ======================================================

async function loadWarehouses() {

    const table =
        document.getElementById(
            "warehouse-table"
        );


    table.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                Đang tải dữ liệu...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(API_BASE_URL + "/warehouse");


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const warehouses =
            await response.json();


        console.log(
            "Warehouse:",
            warehouses
        );


        // Cập nhật số lượng

        document.getElementById(
            "warehouse-count"
        ).textContent =
            warehouses.length;


        // Không có dữ liệu

        if (warehouses.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        Không có dữ liệu kho
                    </td>
                </tr>
            `;

            return;
        }


        // Render table

        table.innerHTML =
            warehouses.map(warehouse => `

                <tr>

                    <td>
                        ${warehouse.id}
                    </td>

                    <td>
                        <strong>
                            ${warehouse.warehouse_name}
                        </strong>
                    </td>

                    <td>
                        ${warehouse.longitude ?? "--"}
                    </td>

                    <td>
                        ${warehouse.latitude ?? "--"}
                    </td>

                    <td>
                        ${renderStatus(
                            warehouse.status
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            warehouse.created_at
                        )}
                    </td>

                </tr>

            `).join("");


    } catch (error) {

        console.error(
            "Lỗi load warehouse:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="6" class="error">
                    Không thể kết nối API Warehouse
                </td>
            </tr>
        `;

    }

}


// ======================================================
// 2. LOAD VEHICLE
// ======================================================

async function loadVehicles() {

    const table =
        document.getElementById(
            "vehicle-table"
        );


    table.innerHTML = `
        <tr>
            <td colspan="5" class="loading">
                Đang tải dữ liệu...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(API.vehicle);


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const vehicles =
            await response.json();


        console.log(
            "Vehicles:",
            vehicles
        );


        document.getElementById(
            "vehicle-count"
        ).textContent =
            vehicles.length;


        if (vehicles.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">
                        Không có dữ liệu xe
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML =
            vehicles.map(vehicle => `

                <tr>

                    <td>
                        ${vehicle.id}
                    </td>

                    <td>
                        <strong>
                            ${vehicle.license_plate}
                        </strong>
                    </td>

                    <td>
                        ${vehicle.warehouse_id}
                    </td>

                    <td>
                        ${renderStatus(
                            vehicle.status
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            vehicle.created_at
                        )}
                    </td>

                </tr>

            `).join("");


    } catch (error) {

        console.error(
            "Lỗi load vehicle:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="5" class="error">
                    Không thể kết nối API Vehicle
                </td>
            </tr>
        `;

    }

}


// ======================================================
// 3. LOAD DEVICE
// ======================================================

async function loadDevices() {

    const table =
        document.getElementById(
            "device-table"
        );


    table.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                Đang tải dữ liệu...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(API.device);


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const devices =
            await response.json();


        console.log(
            "Devices:",
            devices
        );


        document.getElementById(
            "device-count"
        ).textContent =
            devices.length;


        if (devices.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        Không có dữ liệu thiết bị
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML =
            devices.map(device => `

                <tr>

                    <td>
                        ${device.id}
                    </td>

                    <td>
                        <strong>
                            ${device.device_token}
                        </strong>
                    </td>

                    <td>
                        ${device.warehouse_id ?? "--"}
                    </td>

                    <td>
                        ${device.vehicle_id ?? "--"}
                    </td>

                    <td>
                        ${renderStatus(
                            device.status
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            device.created_at
                        )}
                    </td>

                </tr>

            `).join("");


    } catch (error) {

        console.error(
            "Lỗi load device:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="6" class="error">
                    Không thể kết nối API Device
                </td>
            </tr>
        `;

    }

}


// ======================================================
// 4. LOAD DATA
// ======================================================

async function loadSensorData() {

    const table =
        document.getElementById(
            "sensor-table"
        );


    table.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                Đang tải dữ liệu...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(API.data);


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const sensorData =
            await response.json();


        console.log(
            "Sensor Data:",
            sensorData
        );


        document.getElementById(
            "data-count"
        ).textContent =
            sensorData.length;


        if (sensorData.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        Không có dữ liệu cảm biến
                    </td>
                </tr>
            `;

            return;
        }


        // Sắp xếp mới nhất lên đầu

        sensorData.sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        );


        // Dữ liệu mới nhất

        const latest =
            sensorData[0];


        document.getElementById(
            "latest-temperature"
        ).textContent =
            latest.temperature != null
                ? `${latest.temperature} °C`
                : "--";


        document.getElementById(
            "latest-humidity"
        ).textContent =
            latest.humidity != null
                ? `${latest.humidity} %`
                : "--";


        document.getElementById(
            "latest-device"
        ).textContent =
            `#${latest.device_id}`;


        // Đếm dữ liệu vượt nhiệt độ

        const warnings =
            sensorData.filter(item => {

                const temperature =
                    Number(item.temperature);

                return (
                    temperature < 2 ||
                    temperature > 8
                );

            });


        document.getElementById(
            "warning-count"
        ).textContent =
            warnings.length;


        // Render table

        table.innerHTML =
            sensorData.map(item => {

                const temperature =
                    Number(item.temperature);


                const isWarning =
                    temperature < 2 ||
                    temperature > 8;


                return `

                    <tr>

                        <td>
                            ${item.id}
                        </td>

                        <td>
                            DEVICE #${item.device_id}
                        </td>

                        <td>
                            <strong>
                                ${item.temperature ?? "--"} °C
                            </strong>
                        </td>

                        <td>
                            ${item.humidity ?? "--"} %
                        </td>

                        <td>
                            ${formatDate(
                                item.created_at
                            )}
                        </td>

                        <td>

                            ${
                                isWarning

                                ? `
                                    <span class="badge warning">
                                        WARNING
                                    </span>
                                  `

                                : `
                                    <span class="badge active">
                                        NORMAL
                                    </span>
                                  `
                            }

                        </td>

                    </tr>

                `;

            }).join("");


    } catch (error) {

        console.error(
            "Lỗi load data:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="6" class="error">
                    Không thể kết nối API Data
                </td>
            </tr>
        `;

    }

}


// ======================================================
// FORMAT STATUS
// ======================================================

function renderStatus(status) {

    if (!status) {

        return `
            <span class="badge inactive">
                UNKNOWN
            </span>
        `;

    }


    const value =
        String(status).toUpperCase();


    if (
        value === "ACTIVE" ||
        value === "ONLINE" ||
        value === "NORMAL"
    ) {

        return `
            <span class="badge active">
                ${value}
            </span>
        `;

    }


    return `
        <span class="badge inactive">
            ${value}
        </span>
    `;

}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(dateString) {

    if (!dateString) {

        return "--";

    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleString(
        "vi-VN"
    );

}


// ======================================================
// SEARCH WAREHOUSE
// ======================================================

document
    .getElementById("warehouse-search")
    .addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(
                    "#warehouse-table tr"
                )
                .forEach(row => {

                    const text =
                        row.textContent
                            .toLowerCase();


                    row.style.display =
                        text.includes(keyword)
                            ? ""
                            : "none";

                });

        }
    );


// ======================================================
// SEARCH VEHICLE
// ======================================================

document
    .getElementById("vehicle-search")
    .addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(
                    "#vehicle-table tr"
                )
                .forEach(row => {

                    const text =
                        row.textContent
                            .toLowerCase();


                    row.style.display =
                        text.includes(keyword)
                            ? ""
                            : "none";

                });

        }
    );


// ======================================================
// SEARCH DEVICE
// ======================================================

document
    .getElementById("device-search")
    .addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(
                    "#device-table tr"
                )
                .forEach(row => {

                    const text =
                        row.textContent
                            .toLowerCase();


                    row.style.display =
                        text.includes(keyword)
                            ? ""
                            : "none";

                });

        }
    );


// ======================================================
// CLOCK
// ======================================================

function updateTime() {

    const element =
        document.getElementById(
            "current-time"
        );


    const now =
        new Date();


    element.textContent =
        now.toLocaleString(
            "vi-VN"
        );

}
```