<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Intelligence Terminal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[#0b0f19] text-gray-200 font-sans min-h-screen flex flex-col">

    <!-- Top Status Bar -->
    <header class="bg-[#111827] border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
            <div class="bg-red-600 text-white p-2 rounded-lg"><i class="fa-solid fa-database"></i></div>
            <h1 class="text-md font-bold tracking-wider text-white uppercase">Live DB Connector</h1>
        </div>
        <span class="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">System Live</span>
    </header>

    <!-- Main Workspace -->
    <main class="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">
        
        <!-- Search Input Card -->
        <div class="bg-[#111c2a] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div class="flex flex-col sm:flex-row gap-3">
                <input id="targetInput" type="text" placeholder="Enter Live Mobile Number or CNIC..." 
                    class="flex-1 bg-[#090d16] border border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono">
                <button id="searchBtn" class="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                    <i class="fa-solid fa-spinner animate-spin hidden" id="loader"></i>
                    <span>Fetch Live Data</span>
                </button>
            </div>
        </div>

        <!-- Live Result Showcase -->
        <div id="resultBox" class="hidden bg-[#111c2a] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 class="text-xs font-bold uppercase tracking-widest text-amber-500 border-b border-gray-800 pb-2">Database Record Match</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
                <div class="bg-[#090d16] p-3 rounded-xl border border-gray-800/40">
                    <span class="text-[10px] text-gray-500 block uppercase">Full Name</span>
                    <span class="text-white font-bold" id="resName">-</span>
                </div>
                <div class="bg-[#090d16] p-3 rounded-xl border border-gray-800/40">
                    <span class="text-[10px] text-gray-500 block uppercase">CNIC Number</span>
                    <span class="text-white font-bold" id="resCnic">-</span>
                </div>
                <div class="bg-[#090d16] p-3 rounded-xl border border-gray-800/40">
                    <span class="text-[10px] text-gray-500 block uppercase">Phone Number</span>
                    <span class="text-white font-bold" id="resPhone">-</span>
                </div>
                <div class="bg-[#090d16] p-3 rounded-xl border border-gray-800/40">
                    <span class="text-[10px] text-gray-500 block uppercase">Address</span>
                    <span class="text-white font-bold" id="resAddress">-</span>
                </div>
            </div>
        </div>

    </main>

    <!-- JS Logic to Connect to Local Database Server -->
    <script>
        const targetInput = document.getElementById('targetInput');
        const searchBtn = document.getElementById('searchBtn');
        const loader = document.getElementById('loader');
        const resultBox = document.getElementById('resultBox');

        searchBtn.addEventListener('click', async () => {
            const target = targetInput.value.trim();
            if(!target) return alert("Pehle Input Likhein!");

            // Loader On
            loader.classList.remove('hidden');
            resultBox.classList.add('hidden');

            try {
                // Yahan aapka local server call ho raha hai jo SQL query chalayega
                const response = await fetch(`http://localhost:3000/api/search?target=${target}`);
                const result = await response.json();

                if(result.success) {
                    // Agar data mil gaya toh real db fields map karein
                    // (Note: 'full_name', 'address' etc aapke table columns ke naam honge)
                    document.getElementById('resName').innerText = result.data.full_name || "N/A";
                    document.getElementById('resCnic').innerText = result.data.cnic || "N/A";
                    document.getElementById('resPhone').innerText = result.data.mobile_number || "N/A";
                    document.getElementById('resAddress').innerText = result.data.address || "N/A";
                    
                    resultBox.classList.remove('hidden');
                } else {
                    alert("Record nahi mila!");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Server ya Database connected nahi hai!");
            } finally {
                loader.classList.add('hidden');
            }
        });
    </script>
</body>
</html>
