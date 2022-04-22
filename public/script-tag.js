const loadWeb3 = async () => {
    if (window.ethereum) {
        await window.ethereum.enable();
        const walletId = window.ethereum._state.accounts[0]
        fetch(`https://wagmi-server.herokuapp.com/check-collection?walletId=${walletId}&domain=${window.location.origin}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    jQuery(document).ready(function () {
                        $('body').prepend(`
                        <script>
                            function openBenefits() {
                                var x = document.getElementById("benefits-div");
                                if (x.style.display === "none" || x.style.display === "") {
                                x.style.display = "block";
                                } else {
                                x.style.display = "none";
                                }
                            }
                        </script> 
                        <script>
                        </script> 
                            <div id="benefits-div"> 
                                <h2 class="wagmi-header">You have WAGMI Benefits!</h2> 
                                <h4 class="wagmi-subheader">Enter one of the following codes at checkout to receive a special discount</h4> 
                                <div id="benefits" />
                            </div> 
                            <button onclick="openBenefits()" class="wagmi-widget" id="wagmi-button">
                                <h3 class="whiteTextOverride"> WAGMI Benefits </h3> 
                            </button>`
                        );
                        $('head').prepend(`<style>
                            #benefits-div {
                                display: none; 
                                z-index: 1000; 
                                box-shadow: 0px 0px 5px 5px; 
                                border-radius: 10px; 
                                padding: 10px 16px; 
                                background: white; 
                                color: #f1f1f1; 
                                position: fixed; 
                                bottom: 140px; 
                                right: 10px; 
                                border-width: 0px 
                            } 
                            .wagmi-widget { 
                                z-index: 1000; 
                                box-shadow: 10px 5px 5px; 
                                cursor: pointer; 
                                border-radius: 100px; 
                                padding: 5px 16px; 
                                background: linear-gradient(-45deg, #ee7752, #e73c7e); 
                                color: #f1f1f1; 
                                position: fixed; 
                                bottom: 50px; 
                                right: 20px; 
                                border-width: 0px 
                            } 
                            .wagmi-header { 
                                color: black;
                                line-height: 0;
                            } 
                            .wagmi-subheader { 
                                color: gray
                            } 
                            .wagmi-collection-label { 
                                color: gray;
                                font-weight: bold;
                                line-height: 0 !important;
                            } 
                            .wagmi-collection-offer-text { 

                                font-weight: bold;
                                font-size: 16px;
                                line-height: 0 !important;
                            } 
                            .wagmi-discount { 
                                background-image: linear-gradient(300deg, tomato 25%, red 80%);
                                background-clip: text;
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                            } 
                            .wagmi-discount-div { 
                                background-color: #f7feff;
                                padding: 10px;
                                padding-top: 0px;
                                padding-bottom: 0px;
                            } 
                            .whiteTextOverride {
                                color: white !important;
                            } 
                            .benefits-option-div {
                                display: flex; 
                                align-items: center; 
                                justify-content: space-between;
                                margin-bottom: 10px;
                            }
                            </style>`
                        );
                        function generateBenefits() {
                            const benefitList = data.map((benefit) => (
                                `
                                    <div class="benefits-option-div">
                                        <div>
                                            <h4 class="wagmi-collection-label">${benefit.collection_name}</h4>
                                            <h5 class="wagmi-collection-offer-text">${benefit.is_percent ? benefit.discount + "%" : "$" + (benefit.discount).toFixed(2)} discount</h5>
                                        </div> 
                                        <div class="wagmi-discount-div">
                                            <h2 class="wagmi-discount">${benefit.code}</h2>
                                        </div>
                                    </div> 
                                `
                            ))
                            return benefitList.join("")
                        }
                        let list = document.getElementById("benefits");
                        list.innerHTML = (generateBenefits());

                    });
                }
            });
    } else {
        console.log("Not connected");
    }
};
loadWeb3()