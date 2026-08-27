/* ============================================================
   data.js, sourced cost database, due diligence record,
   bill of materials, workload requirements.
   Every figure carries its own citation set.
   ============================================================ */
window.CC = (function () {
  'use strict';

  /* ---------- shared source shorthand ---------- */
  var S = {
    amzA6000:   ['Amazon: PNY NVIDIA RTX A6000 48GB GDDR6', 'https://www.amazon.com/PNY-VCNRTXA6000-PB-NVIDIA-RTX-A6000/dp/B09BDH8VZV'],
    amzQ8000:   ['Amazon: NVIDIA Quadro RTX 8000 48GB GDDR6', 'https://www.amazon.com/dp/B0842YFDRF'],
    amzPro5000: ['Amazon: NVIDIA RTX PRO 5000 Blackwell 48GB GDDR7', 'https://www.amazon.com/dp/B0GLHLSYPC'],
    amzPro6000: ['Amazon: NVD RTX PRO 6000 Blackwell 96GB GDDR7', 'https://www.amazon.com/NVD-RTX-PRO-6000-Blackwell/dp/B0F7Y644FQ'],
    amzA100:    ['Amazon: PNY NVIDIA A100 80GB', 'https://www.amazon.com/PNY-A100-80GB-Graphics-Card/dp/B0CDMFRGWZ'],
    amzA6000b:  ['Amazon: PNY VCNRTXA6000-PB alternate listing', 'https://www.amazon.com/PNY-NVIDIA-Quadro-A6000-Graphics/dp/B08NWGS4X1'],

    cdw6000ada: ['CDW: PNY NVIDIA RTX 6000 Ada 48GB GDDR6 (VCNRTX6000ADA-PB)', 'https://www.cdw.com/product/pny-nvidia-rtx-6000-ada-graphic-card-48-gb-gddr6/7275196'],
    cdw6000blk: ['CDW: PNY NVIDIA Quadro RTX 6000 48GB GDDR6 full height (VCNRTX6000ADA-BLK)', 'https://www.cdw.com/product/pny-nvidia-quadro-rtx-6000-graphic-card-48-gb-gddr6-full-height/7571182'],
    cdwPro6kA:  ['CDW: PNY NVIDIA RTX PRO 6000 96GB GDDR7 full height (VCNRTXPRO6000BQ-PB)', 'https://www.cdw.com/product/pny-nvidia-rtx-pro-6000-graphic-card-96-gb-gddr7-full-height/8326706'],
    cdwPro6kB:  ['CDW: PNY NVIDIA RTX PRO 6000 96GB GDDR7 (VCNRTXPRO6000B-PB)', 'https://www.cdw.com/product/pny-nvidia-rtx-pro-6000-graphic-card-96-gb-gddr7/8326705'],
    cdwPro6kC:  ['CDW: NVIDIA RTX PRO 6000 Blackwell Server Edition 96GB (900-2G153-0000-000)', 'https://www.cdw.com/product/nvidia-rtx-pro-6000-blackwell-server-edition-graphics-card-rtx-pro-60/8379294'],
    cdwPro6kD:  ['CDW: NVIDIA RTX PRO 6000 Blackwell Server Edition 96GB GDDR7 kit (NVRTXPRO6000TCGPU-KIT)', 'https://www.cdw.com/product/nvidia-rtx-pro-6000-blackwell-server-edition-graphics-card-rtx-pro-60/8426124'],
    cdwg:       ['CDW-G: education and public sector contract pricing portal', 'https://www.cdwg.com/'],

    newegg6kAda:['Newegg: PNY RTX 6000 Ada 48GB GDDR6', 'https://www.newegg.com/pny-technologies-inc-vcnrtx6000ada-pb-rtx-6000-ada-48gb-graphics-card/p/N82E16814133886'],
    neweggA6000:['Newegg: PNY NVIDIA Quadro RTX A6000 48GB GDDR6', 'https://www.newegg.com/p/1FT-000P-004A0'],
    neweggPro6k:['Newegg: NVIDIA RTX PRO 6000 Blackwell 96GB GDDR7, 24,064 CUDA cores, 600W', 'https://www.newegg.com/nvidia-blackwell-rtx-pro-6000-96gb-graphic-card/p/N82E16814132106'],
    bh6000Ada:  ['B&H Photo: PNY NVIDIA RTX 6000 Ada 48GB', 'https://www.bhphotovideo.com/c/product/1753962-REG/pny_vcnrtx6000ada_pb_rtx_6000_ada_generation.html'],
    thinkmate:  ['Thinkmate: NVIDIA RTX A6000 48GB GDDR6 PCIe 4.0 x16', 'https://www.thinkmate.com/product/pny/vcnrtxa6000-pb'],
    dellA6000:  ['Dell: PNY NVIDIA Quadro RTX A6000 48GB GDDR6, 300W, PCIe', 'https://www.dell.com/en-us/shop/pny-nvidia-quadro-rtx-a6000-graphics-card-48gb-gddr6-4x-dp-ports-300w-pcie-30/apd/ab398899/graphic-video-cards'],
    nvMarket:   ['NVIDIA Marketplace: RTX A6000 official listing', 'https://marketplace.nvidia.com/en-us/enterprise/laptops-workstations/nvidia-rtx-a6000/'],

    tomsPrice:  ['Toms Hardware: NVIDIA raises RTX PRO 6000 Blackwell list price to $16,000', 'https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year'],
    videocardz: ['VideoCardz: NVIDIA lists RTX PRO 6000 Blackwell 96GB at $13,250', 'https://videocardz.com/newz/nvidia-now-lists-rtx-pro-6000-blackwell-96gb-gpu-at-13250'],
    thunderPx:  ['Thunder Compute: RTX PRO 6000 Blackwell pricing tracker, August 2026', 'https://www.thundercompute.com/blog/nvidia-rtx-pro-6000-pricing'],
    thunderA6:  ['Thunder Compute: NVIDIA RTX A6000 pricing, August 2026', 'https://www.thundercompute.com/blog/nvidia-rtx-a6000-pricing'],
    thunderSpec:['Thunder Compute: NVIDIA RTX A6000 full specifications', 'https://www.thundercompute.com/blog/nvidia-rtx-a6000-specs'],
    igorPrice:  ['Igors Lab: RTX PRO 6000 Blackwell now costs $16,000', 'https://www.igorslab.de/en/nvidia-rtx-pro-6000-blackwell-16000-dollar-96-gb-workstation-gpu-price-increase/'],

    nvWarranty: ['NVIDIA: RTX PRO Workstation graphics card warranty information', 'https://www.nvidia.com/en-us/support/warranty/rtx-pro-workstation-graphics-cards/'],
    nvWarrAll:  ['NVIDIA: product warranties index', 'https://www.nvidia.com/en-us/support/warranty/'],
    nvPower:    ['NVIDIA: power guidelines for workstation products (PDF)', 'https://www.pny.com/file%20library/company/support/product%20brochures/nvidia%20quadro/quadro-power-guidelines.pdf'],
    nvA6000ds:  ['NVIDIA: RTX A6000 product page and datasheet', 'https://www.nvidia.com/en-us/products/workstations/rtx-a6000/'],
    nvBlackwell:['NVIDIA: RTX PRO Blackwell GPU architecture whitepaper (PDF)', 'https://www.nvidia.com/content/dam/en-zz/Solutions/design-visualization/quadro-product-literature/NVIDIA-RTX-Blackwell-PRO-GPU-Architecture-v1.0.pdf'],
    leadtekPro5:['Leadtek: NVIDIA RTX PRO 5000 Blackwell specifications', 'https://www.leadtek.com/eng/products/workstation_graphics(2)/NVIDIA_RTX_PRO_5000_Blackwell(51030)/detail'],
    leadtekA6:  ['Leadtek: NVIDIA RTX A6000 specifications', 'https://www.leadtek.com/eng/products/workstation_graphics(2)/NVIDIA_RTX_A6000(30893)/detail'],

    comed:      ['Plug In Illinois: ComEd price to compare, 10.399 cents per kWh effective June 2026', 'https://plugin.illinois.gov/understanding-the-price-to-compare/price-to-compare-comed.html'],
    ilRates:    ['Illinois commercial electricity rates, 13.07 cents per kWh average', 'https://www.electricchoice.com/electricity-prices-by-state/illinois/'],
    ilComm:     ['Illinois commercial energy benchmarking for 2026', 'https://illinoiscommercialenergy.com/resources/average-illinois-commercial-electricity-bill-benchmarking-for-small-to-medium-businesses-in-2026/'],

    azureA100:  ['Vantage: Azure NC24ads A100 v4 at $3.673 per hour on demand', 'https://instances.vantage.sh/azure/vm/nc24ads-v4'],
    awsG6e:     ['CloudPrice: AWS g6e.xlarge with NVIDIA L40S 48GB', 'https://cloudprice.net/aws/ec2/instances/g6e.xlarge'],
    cloudzero:  ['CloudZero: AWS vs Azure vs GCP GPU pricing comparison 2026', 'https://www.cloudzero.com/blog/cloud-gpu-pricing-comparison/'],
    thunderAws: ['Thunder Compute: EC2 GPU instance guide, August 2026', 'https://www.thundercompute.com/blog/ec2-gpu-instances'],
    thunderAz:  ['Thunder Compute: Azure GPU instances, every series and price', 'https://www.thundercompute.com/blog/azure-gpu-instances'],
    vastPro6k:  ['Vast.ai: RTX PRO 6000 workstation rental from $0.67 per hour', 'https://vast.ai/pricing/gpu/RTX-PRO-6000-WS'],
    lambdaPx:   ['GPUPerHour: Lambda Labs GPU pricing, RTX 6000 Ada from $0.69 per hour', 'https://gpuperhour.com/providers/lambda-labs'],
    runpodPx:   ['GPUPerHour: RunPod GPU pricing, A100 80GB at $1.39 per hour', 'https://gpuperhour.com/providers/runpod'],

    smcStore:   ['Supermicro eStore: 4U GPU server systems', 'https://store.supermicro.com/us_en/systems/gpu/4u-gpu-servers.html'],
    serverStore:['The Server Store: Supermicro 4U rackmount chassis from $499', 'https://www.theserverstore.com/supermicro-servers-supermicro-4u-servers'],
    ramPrice:   ['DatacenterDisk: DDR4 ECC RDIMM live price per GB tracker', 'https://datacenterdisk.com/server-ram/ddr4'],
    ramCrisis:  ['PCSP: DDR4 server memory rose 60 to 80 percent between early 2025 and Q1 2026', 'https://pcserverandparts.com/news/refurbished-ddr4-server-memory-2026-server-ram-price-crisis/'],
    serverCost: ['PCSP: how much does a server cost in 2026, real prices', 'https://pcserverandparts.com/news/how-much-does-a-server-cost-2026/'],
    cherry:     ['Cherry Servers: dedicated server price breakdown 2026', 'https://www.cherryservers.com/blog/dedicated-server-price'],
    qnapNic:    ['QNAP: single port 10GbE network expansion card QXG-10G1T at $139', 'https://store.qnap.com/networking-computing-accelerator-card/networking/10gbe-network-expansion-card.html'],
    apcUps:     ['Amazon: APC Smart-UPS 1500VA 2U rackmount SMC1500-2U', 'https://www.amazon.com/APC-Smart-UPS-Battery-Rack-Mount-SMC1500-2U/dp/B007ZT2KV6'],
    linkup:     ['LINKUP: PCIe 4.0 x16 riser cables for GPU mounting', 'https://linkup.one/pci-e-riser-cables/pcie-4.0/ultra-4.0-riser-cables/'],
    newegg:     ['Newegg: NVMe server storage listings', 'https://www.newegg.com/p/pl?d=nvme+server'],

    capNyu:     ['NYU: equipment capitalization threshold FAQ', 'https://www.nyu.edu/research/resources-and-support-offices/research-finance-support/training/faqs/equipment-capitalization-threshold-faq.html'],
    capCU:      ['University of Colorado: equipment threshold increase from $5,000 to $10,000', 'https://www.colorado.edu/controller/2026/03/02/equipment-threshold-increase-5000-10000'],
    capColumbia:['Columbia University: capitalization of moveable capital equipment policy', 'https://universitypolicies.columbia.edu/content/capitalization-moveable-capital-equipment'],

    aupWsu:     ['Washington State University: Kamiak HPC acceptable use policy', 'https://hpc.wsu.edu/kamiak-hpc/aup/'],
    aupCwru:    ['Case Western Reserve: HPC cluster acceptable use policy', 'https://case.edu/utech/departments/research-computing-and-infrastructure-services/resources/acceptable-use-policy-high-performance-computing-hpc-cluster'],
    aupClemson: ['Clemson Palmetto: acceptable use guidelines', 'https://docs.rcd.clemson.edu/palmetto/acceptable_use_guidelines/'],
    aupUcd:     ['UC Davis: HPC acceptable use policy', 'https://hpc.ucdavis.edu/acceptable-use-policy'],
    aupNcsu:    ['NC State: HPC acceptable use policy', 'https://hpc.ncsu.edu/About/AUP.php'],
    aupHofstra: ['Hofstra Star HPC: acceptable use policy', 'https://starhpc.hofstra.io/aup/'],
    clusterOps: ['Design and operation of shared machine learning clusters on campus (arXiv)', 'https://arxiv.org/html/2110.01556v2'],
    gpunion:    ['GPUnion: autonomous GPU sharing on campus (arXiv 2507.18928)', 'https://arxiv.org/abs/2507.18928'],
    nsdi:       ['USENIX NSDI 2023: transparent GPU sharing in container clouds for deep learning', 'https://www.usenix.org/conference/nsdi23/presentation/wu'],
    slurm:      ['Slurm Workload Manager documentation', 'https://slurm.schedmd.com/documentation.html'],
    dcgm:       ['NVIDIA DCGM: datacenter GPU telemetry and health monitoring', 'https://developer.nvidia.com/dcgm'],

    beebe:      ['Illinois Tech: Nicole L. Beebe named Dean of the College of Computing', 'https://www.iit.edu/news/illinois-tech-names-nicole-l-beebe-new-dean-college-computing'],
    beebe2:     ['Illinois Tech: College of Computing dean announcement detail', 'https://www.iit.edu/news/illinois-tech-names-nicole-l-beebe-new-college-computing-dean'],
    wang:       ['Illinois Tech directory: Yutong Wang, Assistant Professor of Computer Science', 'https://www.iit.edu/directory/people/yutong-wang'],
    wangSite:   ['Yutong Wang: personal research site', 'https://yutongwang.me/'],
    hajek:      ['Illinois Tech directory: Jeremy Hajek, Industry Associate Professor and Smart Lab Director', 'https://www.iit.edu/directory/people/jeremy-hajek'],
    smartlab:   ['Illinois Tech Smart Tech Lab', 'https://www.iit.edu/smartlab'],
    smartlabPr: ['Illinois Tech Smart Lab: projects and research', 'https://www.iit.edu/smartlab/projects-and-research'],
    argonne:    ['Argonne Leadership Computing Facility: Argonne and Illinois Tech research seminar series', 'https://www.alcf.anl.gov/events/argonne-illinois-tech-research-seminar-series'],
    iitHpc:     ['Illinois Tech: high performance and parallel computing research', 'https://www.iit.edu/computer-science/research/research-areas/high-performance-and-parallel-computing'],
    iitCompute: ['Illinois Tech: College of Computing', 'https://www.iit.edu/computing'],

    hunyuan:    ['HunyuanVideo: single GPU inference requirements', 'https://github.com/Tencent-Hunyuan/HunyuanVideo#-single-gpu-inference'],
    hunyuanMg:  ['HunyuanVideo: multi GPU parallel inference with xDiT', 'https://github.com/Tencent-Hunyuan/HunyuanVideo#-parallel-inference-on-multiple-gpus-by-xdit'],
    wan21:      ['Wan2.1: open large scale video generative models', 'https://github.com/Wan-Video/Wan2.1'],
    wanHf:      ['Wan2.1-T2V-14B model card on Hugging Face', 'https://huggingface.co/Wan-AI/Wan2.1-T2V-14B'],
    liveavatar: ['Quark-Vision LiveAvatar: streaming real time avatar generation', 'https://huggingface.co/Quark-Vision/LiveAvatar'],
    isaac:      ['NVIDIA Isaac Sim: system requirements', 'https://docs.isaacsim.omniverse.nvidia.com/5.1.0/installation/requirements.html'],
    blender:    ['Blender Manual: GPU rendering', 'https://docs.blender.org/manual/en/latest/render/cycles/gpu_rendering.html'],
    hfModels:   ['Hugging Face: open model hub', 'https://huggingface.co/models'],
    vllm:       ['vLLM: high throughput LLM serving engine', 'https://github.com/vllm-project/vllm'],
    diffusers:  ['Hugging Face Diffusers documentation', 'https://huggingface.co/docs/diffusers/index'],

    aiIndex:    ['Stanford HAI: 2026 AI Index Report', 'https://hai.stanford.edu/ai-index/2026-ai-index-report'],
    ieee:       ['IEEE Spectrum: Stanford AI Index 2026 and the state of the industry', 'https://spectrum.ieee.org/state-of-ai-index-2026'],
    divide:     ['The compute divide in machine learning (arXiv 2401.02452)', 'https://arxiv.org/pdf/2401.02452']
  };

  /* ============================================================
     COST CITATIONS
     Every approximate figure on the site maps to one of these.
     ============================================================ */
  var COSTS = {

    /* ---------- FULL GREENFIELD SYSTEM ---------- */
    greenfield: {
      title: 'Full greenfield system, buying every component new',
      figure: '$29,409',
      figsub: 'One time capital, nothing donated or reused',
      basis: 'estimate',
      intro: 'This is the number quoted as "upwards of $30,000." It assumes Illinois Tech buys every part new, including the host server, and receives no hosting support. It is the ceiling case, not the plan. The pilot figure is far lower because Professor Hajek has agreed to provide Smart Lab server space.',
      lines: [
        ['48 GB GPU, PNY NVIDIA RTX A6000, GDDR6', 'Amazon list price, seller of record', 5470],
        ['96 GB GPU, NVD RTX PRO 6000 Blackwell, GDDR7', 'Amazon lowest verified new listing', 11860],
        ['4U rackmount GPU chassis', 'Supermicro class barebone, mid configuration', 1500],
        ['Server class CPU', 'Xeon or EPYC class, single socket', 1200],
        ['256 GB DDR4 ECC RDIMM', '8 modules at approximately $400 each at 2026 prices', 3200],
        ['1600W 80 PLUS Platinum redundant PSU', 'Sized for dual GPU headroom', 450],
        ['4 TB enterprise NVMe storage', 'Model and dataset staging', 600],
        ['10 GbE network interface card', 'QNAP QXG-10G1T reference price', 139],
        ['Rack mount UPS, 1500VA', 'APC Smart-UPS SMC1500-2U class', 1130],
        ['PCIe 4.0 riser cables and mounting', 'LINKUP or equivalent', 60],
        ['Rack space, PDU and mounting hardware', 'Physical installation materials', 1200],
        ['Contingency at 10 percent', 'Standard capital budgeting practice', 2600]
      ],
      assumptions: [
        ['Vendor', 'Amazon, the OSL preferred vendor'],
        ['Condition', 'All new, no used or refurbished'],
        ['Priced', 'August 2026'],
        ['Contingency', '10 percent']
      ],
      sources: [S.amzA6000, S.amzPro6000, S.smcStore, S.serverStore, S.ramPrice, S.ramCrisis, S.serverCost, S.cherry, S.qnapNic, S.apcUps, S.linkup]
    },

    /* ---------- PILOT WITH SMART LAB HOSTING ---------- */
    pilot: {
      title: 'The 48 GB pilot, hosted in the Smart Lab',
      figure: '$5,530',
      figsub: 'One time capital for the funding request',
      basis: 'verified',
      intro: 'This is the actual number in front of the Finance Board. Because Professor Hajek has agreed to provide server space and the Smart Lab already operates host infrastructure, the request covers the GPU and its mounting hardware only. The host server, memory, power supply, networking and UPS lines all fall away.',
      lines: [
        ['48 GB GPU, PNY NVIDIA RTX A6000, GDDR6', 'Amazon list price, new, seller of record', 5470],
        ['PCIe 4.0 riser cable and mounting hardware', 'LINKUP or equivalent', 60],
        ['4U rackmount GPU chassis', 'Provided by Smart Lab', 0],
        ['Server class CPU', 'Provided by Smart Lab', 0],
        ['256 GB DDR4 ECC RDIMM', 'Provided by Smart Lab', 0],
        ['1600W redundant PSU', 'Provided by Smart Lab', 0],
        ['10 GbE networking', 'Provided by Smart Lab', 0],
        ['Rack mount UPS', 'Provided by Smart Lab', 0],
        ['Rack space, PDU, cooling', 'Provided by Smart Lab', 0]
      ],
      assumptions: [
        ['Host', 'Smart Lab server resources'],
        ['Confirmed by', 'Professor Jeremy Hajek, verbal'],
        ['Written confirmation', 'Pending, tracked as open item'],
        ['Saving vs greenfield', 'Approximately $9,419']
      ],
      sources: [S.amzA6000, S.cdw6000ada, S.thinkmate, S.dellA6000, S.neweggA6000, S.linkup, S.hajek, S.smartlab]
    },

    /* ---------- 48 GB GDDR6 CARD ---------- */
    gpu48g6: {
      title: '48 GB GDDR6 card, the entry tier',
      figure: '$3,140 to $5,470',
      figsub: 'Verified new listings, August 2026',
      basis: 'verified',
      intro: 'Two GDDR6 cards clear the 48 GB requirement at very different price points. The Quadro RTX 8000 is the lowest cost per gigabyte available new. The RTX A6000 costs more but is four years newer, carries ECC memory, and has far better software support for current frameworks.',
      lines: [
        ['NVIDIA Quadro RTX 8000, 48 GB GDDR6', 'Amazon, new, Turing architecture', 3140],
        ['PNY NVIDIA RTX A6000, 48 GB GDDR6 ECC', 'Amazon, new, Ampere architecture', 5470],
        ['NVIDIA RTX A6000 official listing', 'NVIDIA Marketplace reference', 4650],
        ['PNY RTX 6000 Ada, 48 GB GDDR6 ECC', 'B&H Photo, new, Ada Lovelace architecture', 7499],
        ['PNY RTX 6000 Ada, 48 GB GDDR6', 'Newegg third party seller, same card', 9582]
      ],
      assumptions: [
        ['Recommended', 'RTX A6000 at $5,470'],
        ['Bandwidth', '768 GB per second'],
        ['CUDA cores', '10,752'],
        ['Board power', '300W, single 8 pin'],
        ['Warranty', '3 years, repair or replace']
      ],
      sources: [S.amzA6000, S.amzQ8000, S.nvMarket, S.bh6000Ada, S.newegg6kAda, S.cdw6000ada, S.cdw6000blk, S.thinkmate, S.dellA6000, S.neweggA6000, S.thunderSpec, S.leadtekA6, S.nvA6000ds]
    },

    /* ---------- 48 GB GDDR7 CARD ---------- */
    gpu48g7: {
      title: '48 GB GDDR7 card, the bandwidth tier',
      figure: '$6,298',
      figsub: 'Amazon verified new listing, August 2026',
      basis: 'verified',
      intro: 'The price gap between the two 48 GB options comes down to memory generation. GDDR7 on the RTX PRO 5000 Blackwell delivers 1,344 GB per second against 768 GB per second on GDDR6, which is 75 percent more memory bandwidth. For large model inference, where the bottleneck is moving weights rather than raw compute, that difference shows up directly in tokens per second.',
      lines: [
        ['NVIDIA RTX PRO 5000 Blackwell, 48 GB GDDR7 ECC', 'Amazon, new, Blackwell architecture', 6298],
        ['Premium over RTX A6000 GDDR6', 'Difference for 75 percent more bandwidth', 828]
      ],
      assumptions: [
        ['Bandwidth', '1,344 GB per second'],
        ['CUDA cores', '14,080'],
        ['Memory interface', '384 bit'],
        ['Board power', '300W'],
        ['Generation gap', '4 years newer than A6000']
      ],
      sources: [S.amzPro5000, S.leadtekPro5, S.nvBlackwell, S.thunderSpec]
    },

    /* ---------- 96 GB CARD ---------- */
    gpu96: {
      title: '96 GB card, the growth target',
      figure: '$11,860 to $16,000',
      figsub: 'Spread across five verified vendors',
      basis: 'verified',
      intro: 'The RTX PRO 6000 Blackwell is the card that unlocks 80 GB class workloads. Its price has moved sharply. It launched in March 2025 at $8,565 and NVIDIA raised its own marketplace listing to $16,000 by August 2026, an increase of roughly 87 percent in sixteen months, driven mainly by the GDDR7 memory shortage rather than manufacturing cost. The spread between vendors currently exceeds 34 percent, which is why vendor comparison matters more than usual.',
      lines: [
        ['NVD RTX PRO 6000 Blackwell, 96 GB GDDR7', 'Amazon, lowest verified new listing', 11860],
        ['PNY NVIDIA RTX PRO 6000, 96 GB GDDR7', 'CDW, full height workstation edition', 13413],
        ['NVIDIA official marketplace listing', 'Reported at $13,250 in mid 2026', 13250],
        ['NVIDIA RTX PRO 6000 Blackwell', 'Newegg, workstation edition', 13998],
        ['NVIDIA marketplace list price', 'August 2026, after increase', 16000]
      ],
      assumptions: [
        ['Launch price', '$8,565 in March 2025'],
        ['Increase', 'Roughly 87 percent in 16 months'],
        ['Cause', 'GDDR7 memory shortage'],
        ['Bandwidth', '1.6 TB per second, 512 bit'],
        ['CUDA cores', '24,064'],
        ['Board power', '600W']
      ],
      sources: [S.amzPro6000, S.cdwPro6kA, S.cdwPro6kB, S.cdwPro6kC, S.cdwPro6kD, S.neweggPro6k, S.tomsPrice, S.videocardz, S.igorPrice, S.thunderPx, S.nvBlackwell]
    },

    /* ---------- CDW VS AMAZON ---------- */
    cdwGap: {
      title: 'CDW compared against Amazon',
      figure: 'Up to 40 percent higher',
      figsub: 'Same card, different approved vendor',
      basis: 'estimate',
      intro: 'CDW is an Illinois Tech approved reseller and a valid procurement path. It is materially more expensive at list. A 48 GB card that lists near $5,000 on Amazon has a CDW equivalent above $7,000. The offsetting factor is that CDW-G holds education and public sector contract pricing that is not visible without an account, so list price is not the final price. The recommendation is to request a CDW-G education quote before assuming either number.',
      lines: [
        ['48 GB class card, Amazon list', 'PNY NVIDIA RTX A6000, new', 5470],
        ['48 GB class card, CDW equivalent', 'PNY RTX 6000 Ada, list above $7,000', 7000],
        ['96 GB card, Amazon list', 'NVD RTX PRO 6000 Blackwell', 11860],
        ['96 GB card, CDW list', 'PNY RTX PRO 6000, full height', 13413]
      ],
      assumptions: [
        ['CDW education pricing', 'Requires CDW-G account, quote pending'],
        ['Amazon status', 'OSL preferred vendor'],
        ['Amazon restriction', 'Flagged for lacking Prime benefits'],
        ['Action', 'Written clarification requested from OSL']
      ],
      sources: [S.cdw6000ada, S.cdw6000blk, S.cdwPro6kA, S.cdwPro6kB, S.cdwPro6kC, S.cdwPro6kD, S.cdwg, S.amzA6000, S.amzPro6000]
    },

    /* ---------- ELECTRICITY ---------- */
    power: {
      title: 'Annual electricity for the GPU',
      figure: 'Under $1,000',
      figsub: 'At a deliberately conservative rate',
      basis: 'estimate',
      intro: 'The model uses $0.16 per kWh, which is above every published Illinois benchmark. ComEd price to compare is 10.399 cents effective June 2026 and the Illinois commercial average is around 13.07 cents. Using a rate that is roughly 22 percent above the state commercial average means the real bill should come in below these figures, not above them.',
      lines: [
        ['48 GB card, 300W, continuous operation', '300W times 8,760 hours at $0.16 per kWh', 420],
        ['48 GB card at a realistic 50 percent duty cycle', 'More representative of pilot usage', 210],
        ['96 GB card, 600W, continuous operation', '600W times 8,760 hours at $0.16 per kWh', 841],
        ['96 GB card at 50 percent duty cycle', 'Phase two projection', 420]
      ],
      assumptions: [
        ['Rate used', '$0.16 per kWh, conservative'],
        ['ComEd price to compare', '10.399 cents per kWh'],
        ['Illinois commercial average', '13.07 cents per kWh'],
        ['Card TDP source', 'NVIDIA workstation power guidelines']
      ],
      sources: [S.comed, S.ilRates, S.ilComm, S.nvPower, S.thunderSpec, S.neweggPro6k]
    },

    /* ---------- FULL OPERATING COST ---------- */
    opex: {
      title: 'Annual operating cost, full infrastructure',
      figure: '$1,500 and above',
      figsub: 'GPU, host server, cooling overhead',
      basis: 'estimate',
      intro: 'GPU electricity alone understates the real figure because the host server draws power whether or not a job is running, and cooling adds a multiplier on top of everything. This model applies a 1.4 power usage effectiveness factor, which is a common figure for a well run room that is not a purpose built datacenter.',
      lines: [
        ['GPU electricity, 48 GB card at 50 percent duty', 'Direct card draw', 210],
        ['Host server baseline, approximately 400W continuous', 'Runs regardless of GPU load', 561],
        ['Cooling and distribution overhead at 1.4 PUE', 'Applied to combined draw', 308],
        ['Consumables, spares and cable replacement', 'Small annual allowance', 150],
        ['Monitoring and administration tooling', 'Open source, no license cost', 0],
        ['Student administration labour', 'Contributed by the organizations', 0]
      ],
      assumptions: [
        ['PUE factor', '1.4'],
        ['Electricity rate', '$0.16 per kWh'],
        ['Staff cost', 'Zero, student administered'],
        ['Software cost', 'Zero, Slurm and DCGM are open source']
      ],
      sources: [S.comed, S.ilRates, S.nvPower, S.slurm, S.dcgm, S.cherry]
    },

    /* ---------- CLOUD COMPARISON ---------- */
    cloud: {
      title: 'Cloud rental for one 48 GB class GPU',
      figure: 'Approximately $12,000 per year',
      figsub: 'Recurring, and it never stops',
      basis: 'estimate',
      intro: 'GPUs of the class this initiative needs rent on AWS and Azure at roughly $5 to $10 per hour once realistic utilization is applied to the published rates. At a sustained workload level that a single active club project produces, one 48 GB class GPU reaches about $12,000 per year on cloud credits. The purchased card costs $5,470 once and then belongs to the university.',
      lines: [
        ['Azure NC24ads A100 v4, on demand', 'Published rate per hour', 4],
        ['AWS A100, per GPU per hour', 'Published rate per hour', 3],
        ['AWS g6e.xlarge, NVIDIA L40S 48 GB, entry rate', 'Published rate per hour', 1],
        ['Vast.ai RTX PRO 6000, marketplace low', 'Published rate per hour', 1],
        ['Annual cloud cost at typical club utilization', 'The figure that matters', 12000],
        ['One time cost of owning the same class of card', 'PNY NVIDIA RTX A6000', 5470]
      ],
      assumptions: [
        ['Azure A100', '$3.673 per hour on demand'],
        ['AWS A100', 'Approximately $3.43 per GPU hour'],
        ['AWS L40S 48 GB', 'From approximately $0.56 per hour'],
        ['Break even', 'Well inside the first year'],
        ['Residual value', 'Cloud credits leave nothing behind']
      ],
      sources: [S.azureA100, S.awsG6e, S.cloudzero, S.thunderAws, S.thunderAz, S.vastPro6k, S.lambdaPx, S.runpodPx]
    },

    /* ---------- WARRANTY ---------- */
    warranty: {
      title: 'Warranty coverage and replacement exposure',
      figure: '3 years, $0 exposure',
      figsub: 'Repair or replace, manufacturer backed',
      basis: 'verified',
      intro: 'NVIDIA RTX PRO workstation graphics cards, which include the RTX A6000 and RTX 6000 Ada, carry three year coverage under a repair or replace policy. A failure in month four sits well inside that window, so the replacement cost to Illinois Tech is zero. This is the single strongest reason not to buy a used card, even though used Ampere cards trade at $2,600 to $3,800.',
      lines: [
        ['Manufacturer warranty period', 'NVIDIA RTX PRO workstation cards', 0],
        ['Cost of a month four failure under warranty', 'Repair or replace, no charge', 0],
        ['Cost of the same failure on a used card', 'Full replacement, no coverage', 5470],
        ['Used card market price, tempting but declined', 'Enterprise Ampere, mid 2026', 3200],
        ['Effective saving from buying new', 'Warranty value against used discount', 2270]
      ],
      assumptions: [
        ['Coverage', 'Three years, repair or replace'],
        ['RMA review', 'Typically 1 to 3 business days'],
        ['Proof of purchase', 'Amazon invoice, retained by faculty advisor'],
        ['Used cards', 'Explicitly excluded from this request']
      ],
      sources: [S.nvWarranty, S.nvWarrAll, S.thunderA6, S.amzA6000]
    },

    /* ---------- PHASE TWO ---------- */
    phase2: {
      title: 'Phase two, adding the 96 GB card',
      figure: '$11,920',
      figsub: 'Incremental capital on top of the pilot',
      basis: 'estimate',
      intro: 'Phase two is only requested after the pilot has produced six months of usage data. It adds the 96 GB card that crosses the 80 GB threshold, which is where video generation and real time avatar work become possible at all rather than merely slow.',
      lines: [
        ['96 GB GPU, NVD RTX PRO 6000 Blackwell', 'Amazon, lowest verified new listing', 11860],
        ['PCIe riser and mounting hardware', 'LINKUP or equivalent', 60],
        ['Host infrastructure', 'Already in place from pilot', 0],
        ['Additional cooling capacity', 'Confirmed with Smart Lab before request', 0]
      ],
      assumptions: [
        ['Trigger', 'Six months of pilot usage data'],
        ['Board power', '600W, up from 300W'],
        ['Power headroom', 'To be confirmed with Professor Hajek'],
        ['Funding path', 'Finance Board, sponsorship, or NVIDIA grant']
      ],
      sources: [S.amzPro6000, S.cdwPro6kA, S.neweggPro6k, S.tomsPrice, S.linkup, S.hajek]
    },

    /* ---------- SMART LAB SAVING ---------- */
    savings: {
      title: 'What Smart Lab hosting removes from the budget',
      figure: '$9,419',
      figsub: 'Capital cost avoided',
      basis: 'estimate',
      intro: 'Professor Hajek agreeing to provide server space is the single largest cost reduction in this proposal. Every line below would otherwise appear in the funding request. This is why the ask is roughly $5,500 rather than roughly $30,000.',
      lines: [
        ['4U rackmount GPU chassis', 'Avoided', 1500],
        ['Server class CPU', 'Avoided', 1200],
        ['256 GB DDR4 ECC RDIMM', 'Avoided', 3200],
        ['1600W redundant PSU', 'Avoided', 450],
        ['4 TB enterprise NVMe storage', 'Avoided', 600],
        ['10 GbE network interface card', 'Avoided', 139],
        ['Rack mount UPS', 'Avoided', 1130],
        ['Rack space, PDU and mounting', 'Avoided', 1200]
      ],
      assumptions: [
        ['Confirmed by', 'Professor Jeremy Hajek, verbal'],
        ['Scope agreed', 'Server space to install and host'],
        ['Written confirmation', 'Pending'],
        ['Accountability', 'Students in affiliated organizations']
      ],
      sources: [S.hajek, S.smartlab, S.smartlabPr, S.smcStore, S.serverStore, S.ramPrice, S.qnapNic, S.apcUps]
    }
  };

  /* ============================================================
     DUE DILIGENCE RECORD
     ============================================================ */
  var DILIGENCE = [
    /* ---------------- HARDWARE AND COST ---------------- */
    { cat:'hardware', st:'lock', q:'Is the $2,000, $5,000, $10,000 figure the benchmark for a new, used, or refurbished card, and who is the seller of record? You will not purchase a used card, correct?',
      a:'<p>All three benchmarks are for <b>new, manufacturer sealed cards</b>. The seller of record is <b>Amazon</b>, which is currently the only vendor used because it is an OSL preferred vendor inside BuyIt, the Illinois Tech Unimarketplace.</p>'
       +'<p><b>Confirmed: no used or refurbished cards will be purchased.</b> Used enterprise Ampere cards currently trade around $2,600 to $3,800, and that discount is deliberately declined because a used card forfeits the three year manufacturer warranty. Losing warranty coverage converts a month four failure from a zero dollar RMA into a full replacement request that the Finance Board is unlikely to approve.</p>'
       +'<p>Vendor research beyond Amazon is underway, and verified CDW, Newegg, B&amp;H, Dell and Thinkmate listings for the same cards are published on this site.</p>',
      cite:'gpu48g6' },

    { cat:'hardware', st:'lock', q:'What is the exact model and VRAM type needed?',
      a:'<p>The minimum viable configuration is <b>one 48 GB VRAM GPU</b>, hosted in the Smart Lab and available to all Illinois Tech students. There are two candidate cards at that capacity and the price gap between them is a memory generation gap, not a capacity gap.</p>'
       +'<ul><li><b>GDDR6 tier.</b> NVIDIA Quadro RTX 8000 at $3,140 or PNY NVIDIA RTX A6000 at $5,470. The A6000 delivers 768 GB per second of bandwidth across 10,752 CUDA cores, with ECC memory and a 300W board power envelope.</li>'
       +'<li><b>GDDR7 tier.</b> NVIDIA RTX PRO 5000 Blackwell at $6,298. It delivers 1,344 GB per second across 14,080 CUDA cores, which is <b>75 percent more memory bandwidth</b> for roughly $828 more than the A6000.</li></ul>'
       +'<p>The growth target is a <b>96 GB RTX PRO 6000 Blackwell</b>, which is where video generation, real time avatars and 70B class model serving become genuinely practical rather than merely possible.</p>',
      cite:'gpu48g7' },

    { cat:'hardware', st:'lock', q:'Does it carry a manufacturer warranty, and what is the RMA process?',
      a:'<p>Yes. NVIDIA RTX PRO workstation graphics cards, a category that includes the RTX A6000 and RTX 6000 Ada, carry <b>three year coverage under a repair or replace policy</b> direct from NVIDIA.</p>'
       +'<p><b>RMA process.</b> Claims route through the board partner, typically PNY or Leadtek, or through NVIDIA support directly. Proof of purchase in the form of the original invoice is required, and partner review of a submitted claim typically completes within one to three business days. The Amazon invoice serves as proof of purchase and is retained by the ML Club faculty advisor as owner of record, so the document does not leave with a graduating student.</p>'
       +'<p>A full RMA runbook, including who submits, who ships, and what the interim degraded service looks like, is being written into the operations documentation.</p>',
      cite:'warranty' },

    { cat:'hardware', st:'lock', q:'If the card fails in month four, who replaces it and with what funds?',
      a:'<p>Month four falls inside the three year warranty, so the replacement cost to Illinois Tech is <b>zero dollars</b>. NVIDIA repairs or replaces the card and the funding question does not arise.</p>'
       +'<p>Realistically the card is unlikely to fail outright unless it is severely physically damaged or attacked by a malicious actor. Both scenarios are in the risk register with specific mitigations.</p>'
       +'<p><b>Outside warranty,</b> replacement and maintenance is funded through student organization budgets. This matters strategically: the Finance Board is considerably more likely to approve a maintenance line item than a fresh capital request for a whole new GPU. The organization administration plan therefore places executive members on active monitoring and preventive maintenance so that faults are caught while they are still cheap.</p>',
      cite:'warranty' },

    { cat:'hardware', st:'prog', q:'What does the full system cost, including chassis, power supply, cooling, networking and storage, not just the card? Can the current server handle this new card?',
      a:'<p><b>Buying everything new,</b> including servers, connectors, 48 GB and 96 GB GPUs and all supporting hardware, the long run projection is <b>upwards of $30,000</b>. That is the ceiling case and it is not the plan.</p>'
       +'<p><b>Because Professor Hajek has agreed to provide Smart Lab server space,</b> the initiative can leverage existing server resources instead of buying its own. That removes roughly $9,419 of capital from the request and brings the pilot down to about $5,530.</p>'
       +'<p><b>On card compatibility,</b> the RTX A6000 is undemanding by server standards. It is a dual slot, full height card on a standard PCIe 4.0 x16 interface, drawing 300W through a single 8 pin connector with an active blower cooler. There is no SXM baseboard and no specialised power delivery requirement, which is why it deploys cleanly into workstations and 1U or 2U servers alike.</p>'
       +'<p><b>Open item:</b> exact chassis compatibility, available PCIe slots and power headroom in the specific Smart Lab host will be confirmed directly with Professor Hajek. The card side specification is documented precisely so that conversation starts from numbers rather than estimates.</p>',
      cite:'greenfield' },

    { cat:'hardware', st:'lock', q:'What is the annual operating cost, including electricity?',
      a:'<p><b>Under $1,000 per year for GPU electricity,</b> and <b>$1,500 or more per year</b> once the full supporting infrastructure is counted.</p>'
       +'<p>The model uses <b>$0.16 per kWh</b>, which is deliberately conservative. The ComEd price to compare is 10.399 cents per kWh effective June 2026, and the Illinois commercial average sits around 13.07 cents. Running the model roughly 22 percent above the state commercial average means the real bill should land below the projection rather than above it.</p>'
       +'<p>At that rate a 300W card running continuously costs about $420 per year, and a realistic duty cycle brings it closer to $210. The 600W 96 GB card reaches about $841 at full continuous load. Adding the host server baseline draw and a 1.4 power usage effectiveness factor for cooling produces the $1,500 plus figure for total infrastructure.</p>'
       +'<p>Software carries no licence cost because Slurm and NVIDIA DCGM are open source, and administration labour is contributed by the student organizations.</p>',
      cite:'opex' },

    /* ---------------- PROCUREMENT ---------------- */
    { cat:'procure', st:'prog', q:'Has anyone asked OSL directly why GPUs are on the restricted vendor list? Could you get this response in writing?',
      a:'<p>Yes, and the answer is narrower than a category ban. According to <b>BuyIt</b>, the Illinois Tech Unimarketplace, the restriction exists because the GPU listings lack <b>Prime benefits</b>. It is a fulfilment attribute flag, not a policy position that GPUs may not be purchased.</p>'
       +'<p><b>Open item:</b> this is being clarified with Sarah at the Finance Board and <b>the response will be obtained in writing</b> after that meeting. Written confirmation is treated as a gating requirement before the proposal advances to the Dean or to external partners, precisely so that nobody else finds this gap first.</p>',
      cite:'cdwGap' },

    { cat:'procure', st:'lock', q:'Would OSL approve a purchase through CDW or another university approved reseller? Have you already checked the price differences?',
      a:'<p>Yes, CDW is a viable approved path, and yes, the price differences have been checked. <b>CDW is materially more expensive at list.</b></p>'
       +'<p>A 48 GB card evaluated at approximately $5,000 on Amazon has a CDW equivalent listing <b>above $7,000</b>. The same pattern holds at 96 GB, where Amazon shows $11,859.99 against CDW at $13,412.99. Direct CDW product listings for both capacities are published in the hardware section of this site.</p>'
       +'<p><b>The offsetting factor.</b> CDW-G holds education and public sector contract pricing that is not visible without an institutional account. List price is therefore not the final price, and cheaper CDW listings do exist. The recommendation in the proposal is to request a CDW-G education quote before assuming either the Amazon or the CDW public number.</p>',
      cite:'cdwGap' },

    { cat:'procure', st:'lock', q:'What dollar threshold makes this a capital equipment purchase rather than a supply purchase?',
      a:'<p><b>There is no explicit dollar threshold in OSL or Finance Board</b> that separates capital equipment from project items. Because no threshold governs the decision, the GPUs have been <b>listed as capital items in the budget</b>, which is the conservative and more scrutinised classification.</p>'
       +'<p>For external reference, the general higher education standard is a unit cost of $5,000 or more with a useful life exceeding one year. Federal Uniform Guidance raised its own equipment capitalization threshold from $5,000 to $10,000 for awards issued or amended on or after 1 October 2024. The pilot card sits at $5,470, which clears the traditional $5,000 line and sits below the revised federal line.</p>',
      cite:null },

    { cat:'procure', st:'sched', q:'Who is the university asset owner once it is bought? Has a faculty member signed off on being responsible for the hardware already?',
      a:'<p>The two faculty roles are deliberately separated.</p>'
       +'<ul><li><b>Professor Jeremy Hajek</b>, Industry Associate Professor and Smart Lab Director, provides the hosting environment.</li>'
       +'<li><b>Professor Yutong Wang</b>, Assistant Professor of Computer Science and ML Club advisor, is the intended <b>signing faculty and asset owner of record</b>.</li></ul>'
       +'<p>Professor Wang researches the theory of modern machine learning, including overparameterized learning, uncertainty estimation and privacy preserving machine learning, which sits directly adjacent to the workloads this suite would run.</p>'
       +'<p><b>Open item:</b> the meeting with Professor Wang is scheduled immediately after this site is complete, and sign off has not yet been obtained. This is stated plainly rather than implied as settled.</p>',
      cite:null },

    { cat:'procure', st:'lock', q:'What exactly did Professor Hajek agree to, permission to install, or hosting, space, and accountability?',
      a:'<p>Professor Hajek agreed to <b>provide the server space to install and host the GPU or GPUs</b>. That is hosting and space.</p>'
       +'<p><b>Accountability is separate and sits with students</b> in the affiliated organizations, operating under Smart Lab oversight. The governance model was designed this way on purpose: the Smart Lab supplies the physical environment and institutional oversight, and the student organizations supply the administration, documentation, monitoring and incident response. Neither party is asked to absorb the other party&rsquo;s workload.</p>',
      cite:'savings' },

    { cat:'procure', st:'prog', q:'Is any of that in writing?',
      a:'<p><b>No. None of it is in official writing so far.</b></p>'
       +'<p>This is the single most important open item in the entire proposal and it is tracked as the top priority action. Written confirmation is being obtained from three parties before this advances further:</p>'
       +'<ul><li><b>Professor Hajek</b>, confirming hosting, space and physical constraints.</li>'
       +'<li><b>Professor Wang</b>, confirming asset ownership of record.</li>'
       +'<li><b>Sarah at the Finance Board</b>, confirming the OSL vendor restriction rationale and the approved procurement path.</li></ul>'
       +'<p>The proposal does not ask any department to act on verbal agreements. It asks for approval of direction while these confirmations are collected in parallel.</p>',
      cite:null },

    { cat:'procure', st:'lock', q:'What is Dean Beebe&rsquo;s current portfolio? Is it related to this work?',
      a:'<p><b>Yes, directly.</b> Nicole L. Beebe became Dean of the College of Computing on 1 July 2025, arriving from the University of Texas at San Antonio with more than 25 years of industry, government and academic experience in cybersecurity.</p>'
       +'<p>The Dean&rsquo;s portfolio covers advancing undergraduate and graduate programs, expanding online learning, and <b>strengthening strategic partnerships</b>. The College is explicitly positioned as a leader in data science, artificial intelligence and cybersecurity, and is <b>facilitating collaboration with Argonne National Laboratory</b> at the intersection of high performance computing and AI.</p>'
       +'<p>Dean Beebe expressed direct interest in furthering AI initiatives and education at an event I attended a year ago. A student administered, governed, logged GPU suite is a low cost and highly visible instrument of exactly that portfolio, and it connects the undergraduate population to the HPC and AI direction the College is already pursuing at the research level.</p>',
      cite:null },

    { cat:'procure', st:'sched', q:'What are the Smart Lab&rsquo;s physical constraints, including power, rack space, cooling and network drops?',
      a:'<p><b>Open item.</b> Power availability, rack space, cooling capacity and network drops are being investigated directly with Professor Hajek at the next meeting.</p>'
       +'<p>The card side of that conversation is already fully specified so it starts from numbers rather than guesses:</p>'
       +'<ul><li><b>Form factor.</b> Dual slot, full height.</li>'
       +'<li><b>Interface.</b> PCIe 4.0 x16, no SXM baseboard required.</li>'
       +'<li><b>Board power.</b> 300W for the 48 GB pilot card, 600W for the 96 GB phase two card.</li>'
       +'<li><b>Power connector.</b> Single 8 pin.</li>'
       +'<li><b>Cooling.</b> Active blower design, suited to rackmount airflow.</li></ul>'
       +'<p>The 300W to 600W step between phase one and phase two is flagged explicitly, because power headroom is the constraint most likely to gate expansion.</p>',
      cite:'greenfield' },

    /* ---------------- GOVERNANCE ---------------- */
    { cat:'govern', st:'lock', q:'Who besides you could run this if you stepped away tomorrow?',
      a:'<p><b>Executive members in each of the five affiliated student organizations</b>, who are being trained specifically to maintain this suite.</p>'
       +'<p>Several incoming undergraduates have already committed to the initiative and are taking on executive roles in the organizations partly in order to carry this work forward. Continuity is therefore built on a cohort rather than on one person.</p>'
       +'<p>Documentation and maintenance requirements are in preparation now and will be distributed to each organization, so the operating knowledge lives in a written runbook rather than in anyone&rsquo;s memory. Root access is tied to organizational office rather than to individuals, which means a graduating president hands over credentials as part of a normal transition.</p>',
      cite:null },

    { cat:'govern', st:'lock', q:'Who holds root access, and who holds it after you graduate?',
      a:'<p>Root access is held by the <b>presidents of each affiliated organization</b>, and potentially by faculty and advisors once written confirmations of support are secured.</p>'
       +'<p>The critical design decision is that <b>root travels with the office, not the person</b>. When a president graduates, the incoming president receives access as part of the standard executive transition, and the outgoing credential is revoked. Graduation therefore does not create an access gap, and no single individual can become a point of failure.</p>'
       +'<p>The faculty advisor of the ML Club retains independent access as owner of record, which guarantees institutional access even in a scenario where an entire executive board turns over at once.</p>',
      cite:null },

    { cat:'govern', st:'lock', q:'Who administers it over summer and winter break?',
      a:'<p>The same people, because <b>administration is remote by design</b>.</p>'
       +'<p>Routine administration is hands off. Administrators SSH into the server and handle issues as they arise, which works identically in July and in December. There is no requirement for anyone to be physically on campus for software faults, job queue problems, user onboarding, storage cleanup or usage reporting.</p>'
       +'<p><b>Physical intervention,</b> in the rare cases it is needed, is covered by advisors or by an identified faculty group inside the Smart Lab. That group will be named in writing as part of the same confirmation round as the hosting agreement.</p>',
      cite:null },

    { cat:'govern', st:'sched', q:'What staff or faculty position is the owner of record long term?',
      a:'<p>The <b>faculty advisor of the ML Club</b> owns the record long term. That is currently Professor Yutong Wang, pending the confirmation meeting.</p>'
       +'<p>Tying ownership to the advisor position rather than to a named individual means the record survives faculty turnover in the same way it survives student turnover. Operating documentation is additionally kept in a <b>standardized location in the server room</b>, so future executive members inherit it directly without depending on any personal handover.</p>',
      cite:null },

    { cat:'govern', st:'prog', q:'Does the acceptable use policy exist yet, or is it still planned?',
      a:'<p><b>It is drafted in discussion but not yet in official writing.</b> The acceptable use policy has been raised with each student organization and the substance is agreed, but the formal document is still being produced.</p>'
       +'<p>It is being written against established university HPC precedent rather than invented from scratch, drawing on published policies from Washington State University Kamiak, Case Western Reserve, Clemson Palmetto, UC Davis, NC State and Hofstra Star HPC. Building on recognised precedent means the document arrives as something an Illinois Tech reviewer will find familiar, and it shortens the approval path.</p>'
       +'<p>Every user signs the policy before receiving credentials. Access is individual, logged and revocable.</p>',
      cite:null },

    { cat:'govern', st:'prog', q:'What use is prohibited, and who enforces it?',
      a:'<p>Prohibited use is documented in the acceptable use policy and enforced through <b>automated systems plus the relevant ML Club executive members</b>.</p>'
       +'<p>The prohibition set follows peer institution standards:</p>'
       +'<ul><li><b>Cryptocurrency mining</b> of any kind, including validation and transaction support.</li>'
       +'<li><b>Commercial work</b> without explicit prior authorization.</li>'
       +'<li><b>Credential sharing</b> or any use of another person&rsquo;s account.</li>'
       +'<li><b>Circumventing the scheduler</b> or quota system to monopolise the resource.</li>'
       +'<li><b>Storing restricted or regulated data</b> outside approved handling.</li></ul>'
       +'<p>Enforcement is primarily automated because automation is impartial and does not depend on a student volunteer noticing something. Job telemetry, utilization patterns and storage consumption are monitored continuously, with human review reserved for judgement calls.</p>',
      cite:null },

    { cat:'govern', st:'prog', q:'What happens if someone misuses it, who is notified, and what is the response?',
      a:'<p>On detection, <b>the server sends an automated relay to the relevant executive members of each organization</b>. A defined response pipeline is being established around that trigger.</p>'
       +'<p>The escalation model being adopted, based on researched practice at peer HPC facilities, runs in four stages:</p>'
       +'<ul><li><b>Detect.</b> Automated telemetry flags the anomaly, whether that is a prohibited workload signature, a quota breach or an unusual access pattern.</li>'
       +'<li><b>Notify.</b> Automated relay to organization executives, with the ML Club executive as primary responder.</li>'
       +'<li><b>Suspend.</b> The offending job is halted and the account is suspended pending review. Suspension is immediate and automatic rather than discretionary.</li>'
       +'<li><b>Review and resolve.</b> Executive review determines restoration, warning, or permanent revocation, with the faculty advisor notified for anything beyond a first minor infraction.</li></ul>'
       +'<p>Because every user signs the policy and access is individual and logged, every action is attributable to a named person. There are no shared credentials and no anonymous compute.</p>',
      cite:null },

    /* ---------------- FUNDING ---------------- */
    { cat:'funding', st:'prog', q:'What single dollar figure are we requesting, and from whom first?',
      a:'<p>The request is the <b>48 GB pilot at approximately $5,530</b>, routed through <b>OSL and the Finance Board first</b>.</p>'
       +'<p>That figure covers the PNY NVIDIA RTX A6000 at $5,470 plus mounting hardware, and it assumes Smart Lab hosting removes the server, memory, power supply, networking and UPS lines from the request.</p>'
       +'<p><b>Honest caveat:</b> only the earlier approximates existed before this analysis, because no positive sponsorship response has been received yet. The figure is now finalised against verified vendor listings published on this site, and every component in it is individually sourced and linked.</p>',
      cite:'pilot' },

    { cat:'funding', st:'lock', q:'Does that figure cover the full system or only the GPU?',
      a:'<p>The headline figure covers the <b>GPU and its mounting hardware</b>. It does not include a host server, because Smart Lab hosting supplies that.</p>'
       +'<p>The full system is nonetheless modelled in detail on this site so that long term estimates for electricity, cooling, server workload and supporting items can be tested rather than assumed. Three figures are published side by side:</p>'
       +'<ul><li><b>$29,409</b> for a full greenfield build with nothing donated.</li>'
       +'<li><b>$9,419</b> of capital removed by Smart Lab hosting.</li>'
       +'<li><b>$5,530</b> for the actual pilot request.</li></ul>'
       +'<p>Annual operating cost is separately modelled at under $1,000 for GPU electricity and $1,500 or more for full infrastructure.</p>',
      cite:'pilot' },

    { cat:'funding', st:'lock', q:'Have you compared purchase cost against AWS or Azure education credits, and at what usage level does owning win?',
      a:'<p>Yes, and <b>owning wins decisively and quickly</b>.</p>'
       +'<p>GPUs of the class this initiative needs rent on AWS and Azure at roughly <b>$5 to $10 per hour</b> once realistic utilization is applied. Published reference rates include Azure NC24ads A100 v4 at $3.673 per hour on demand and AWS A100 at approximately $3.43 per GPU hour, with AWS g6e.xlarge carrying an NVIDIA L40S 48 GB from around $0.56 per hour at entry.</p>'
       +'<p>At the sustained workload a single active club project produces, <b>one 48 GB class GPU costs approximately $12,000 per year on cloud credits</b>. The purchased card costs $5,470 once. Break even arrives <b>well inside the first year</b>, and after that the university owns a depreciating asset instead of holding nothing.</p>'
       +'<p><b>Two arguments beyond price.</b> First, cloud credits expire and leave no residual value. Second, a persistent cluster avoids the operational risk of repeatedly powering hardware up and down to control spend, which increases maintenance burden and introduces failure modes that a continuously running system does not have. Managing that persistent infrastructure is itself a substantial learning outcome for organization members.</p>',
      cite:'cloud' },

    { cat:'funding', st:'lock', q:'What does the pilot need to demonstrate at six months to justify phase two?',
      a:'<p>The pilot must demonstrate <b>hours of usage indicating how often the cluster is actually leveraged</b>, supported by usage logs and submitted job frequency. The full KPI set is published on this site with specific six month targets.</p>'
       +'<p>The metrics fall into three groups:</p>'
       +'<ul><li><b>Utilization.</b> GPU hours delivered, average duty cycle, queue depth and peak concurrency.</li>'
       +'<li><b>Reach.</b> Unique students served across all five organizations, workshops run with attendance, and organizations actively submitting jobs.</li>'
       +'<li><b>Output.</b> Projects shipped, public repositories, hackathon entries and demonstrable portfolio artifacts.</li></ul>'
       +'<p>Reporting is monthly rather than only at the six month mark, so the funding body sees the trend forming rather than receiving a single retrospective claim. Every number comes from automated telemetry rather than self reporting.</p>',
      cite:'phase2' }
  ];

  /* ============================================================
     WORKLOAD VRAM REQUIREMENTS
     ============================================================ */
  var WORKLOADS = [
    { id:'hunyuan', name:'HunyuanVideo', full:'HunyuanVideo, text to video', tag:'Generative video, Tencent',
      desc:'Open source 13B text to video foundation model. The official repository states that generating a 720p, 129 frame clip requires a minimum of 60 GB of GPU memory, was tested on a single 80 GB GPU, and that 80 GB is recommended.',
      levels:{ g24:[10,'no','Cannot load'], g48:[55,'no','Below minimum'], g96:[96,'great','Full quality'] },
      meaning:'This single workload is the clearest argument for 96 GB. A 48 GB card cannot reach the documented minimum for 720p generation. A 96 GB RTX PRO 6000 clears it with headroom.',
      links:[S.hunyuan, S.hunyuanMg] },

    { id:'wan', name:'Wan 2.1 and 2.2', full:'Wan 2.1 and 2.2 video foundation models', tag:'Text to video, image to video, editing',
      desc:'Open video foundation models covering text to video, image to video, video editing and image generation. Smaller variants run in roughly 48 GB of VRAM, and the 14B class is comfortable at 80 GB.',
      levels:{ g24:[26,'no','Small models only'], g48:[76,'ok','Entry level work'], g96:[98,'great','Production class'] },
      meaning:'48 GB unlocks real student video generation today. 96 GB is what makes it fast enough to run inside a 90 minute workshop or a 36 hour hackathon.',
      links:[S.wan21, S.wanHf] },

    { id:'avatar', name:'LiveAvatar', full:'LiveAvatar, real time streaming avatars', tag:'Real time, audio driven',
      desc:'Streaming, audio driven avatar generation with infinite length. Real time research demonstrations are documented against an 80 GB class GPU because frames must be produced faster than they are consumed.',
      levels:{ g24:[12,'no','Not viable'], g48:[50,'no','Not real time'], g96:[94,'great','Real time demo'] },
      meaning:'Real time is a hard threshold, not a preference. Either the GPU sustains the frame budget or the demo does not exist. This is the use case that validates 80 GB class compute.',
      links:[S.liveavatar] },

    { id:'llm', name:'Local LLM serving', full:'Local LLM serving and fine tuning', tag:'Private inference, LoRA, RAG',
      desc:'Running open weight models on hardware you control, with no per token billing and no data leaving campus. A 70B model needs roughly 40 GB quantized to 4 bit, or 140 GB and above at full precision. Fine tuning adds optimizer and gradient state on top of weights.',
      levels:{ g24:[30,'tight','7B to 13B only'], g48:[72,'ok','70B quantized'], g96:[97,'great','70B plus fine tune'] },
      meaning:'This is the workhorse. A 96 GB card serves a 70B class assistant to an entire workshop room while a 48 GB card handles individual student fine tuning jobs in parallel.',
      links:[S.hfModels, S.vllm] },

    { id:'robotics', name:'Robotics simulation', full:'Robotics simulation and reinforcement learning', tag:'Isaac Sim, ITR, Smart Lab',
      desc:'NVIDIA Isaac Sim documents an RTX class GPU with substantial VRAM for photorealistic robot simulation. Reinforcement learning multiplies the requirement because thousands of environments are stepped in parallel on one device.',
      levels:{ g24:[42,'tight','Basic scenes'], g48:[80,'ok','Multi environment RL'], g96:[96,'great','Full fidelity'] },
      meaning:'Illinois Tech Robotics and Smart Lab teams could train and validate robot behaviour in simulation before risking physical hardware, turning a broken servo into a failed rollout.',
      links:[S.isaac] },

    { id:'diffusion', name:'Image generation', full:'High quality image generation', tag:'Diffusion, design assets, datasets',
      desc:'Modern diffusion models benefit substantially from 24 to 48 GB when working at higher resolution, with larger base models, ControlNets and multi image batches for dataset synthesis.',
      levels:{ g24:[62,'ok','Solid workflows'], g48:[92,'great','Pro resolution'], g96:[99,'great','Batch and train'] },
      meaning:'A shared 48 GB GPU lets students produce professional quality images, synthetic datasets, design assets and visual prototypes without paying per generation cloud fees.',
      links:[S.diffusers] },

    { id:'arvr', name:'AR and VR', full:'AR and VR simulation environments', tag:'IGDA, immersive systems',
      desc:'24 GB supports basic VR scenes. High fidelity environments with realistic lighting, embedded AI agents and complex interaction systems push well past that, especially when rendering and inference share one device.',
      levels:{ g24:[45,'tight','Basic scenes'], g48:[84,'ok','High fidelity'], g96:[97,'great','Scene plus agents'] },
      meaning:'Students can prototype immersive training tools, interactive simulations and AR/VR research projects, which is exactly the portfolio work that game design and HCI employers ask to see.',
      links:[S.blender] },

    { id:'voice', name:'Voice and speech', full:'Voice cloning, ASR and speech synthesis', tag:'Accessibility, media, agents',
      desc:'Speech recognition and neural speech synthesis are comparatively light per model, but real applications stack them. ASR feeds an LLM which feeds a vocoder, all resident simultaneously and all latency sensitive.',
      levels:{ g24:[58,'ok','Single model'], g48:[88,'great','Full pipeline'], g96:[98,'great','Multi user'] },
      meaning:'Accessibility tooling, multilingual campus media and conversational agents all become buildable student projects rather than API bills.',
      links:[['Hugging Face speech recognition models','https://huggingface.co/models?pipeline_tag=automatic-speech-recognition']] }
  ];

  /* ============================================================
     BILL OF MATERIALS for the interactive cost builder
     ============================================================ */
  var BOM = [
    { id:'gpu48',  name:'48 GB GPU, PNY NVIDIA RTX A6000 GDDR6', src:'Amazon, new, seller of record', price:5470, on:true,  lab:false, cite:'gpu48g6' },
    { id:'gpu96',  name:'96 GB GPU, NVD RTX PRO 6000 Blackwell GDDR7', src:'Amazon, lowest verified new listing', price:11860, on:false, lab:false, cite:'gpu96' },
    { id:'riser',  name:'PCIe 4.0 riser cable and mounting hardware', src:'LINKUP or equivalent', price:60, on:true, lab:false, cite:'greenfield' },
    { id:'chassis',name:'4U rackmount GPU chassis', src:'Supermicro class barebone', price:1500, on:false, lab:true, cite:'greenfield' },
    { id:'cpu',    name:'Server class CPU', src:'Xeon or EPYC class, single socket', price:1200, on:false, lab:true, cite:'greenfield' },
    { id:'ram',    name:'256 GB DDR4 ECC RDIMM', src:'8 modules at approximately $400 each', price:3200, on:false, lab:true, cite:'greenfield' },
    { id:'psu',    name:'1600W 80 PLUS Platinum redundant PSU', src:'Sized for dual GPU headroom', price:450, on:false, lab:true, cite:'greenfield' },
    { id:'nvme',   name:'4 TB enterprise NVMe storage', src:'Model and dataset staging', price:600, on:false, lab:true, cite:'greenfield' },
    { id:'nic',    name:'10 GbE network interface card', src:'QNAP QXG-10G1T reference', price:139, on:false, lab:true, cite:'greenfield' },
    { id:'ups',    name:'Rack mount UPS, 1500VA', src:'APC Smart-UPS SMC1500-2U class', price:1130, on:false, lab:true, cite:'greenfield' },
    { id:'rack',   name:'Rack space, PDU and mounting hardware', src:'Physical installation materials', price:1200, on:false, lab:true, cite:'greenfield' }
  ];

  return { S:S, COSTS:COSTS, DILIGENCE:DILIGENCE, WORKLOADS:WORKLOADS, BOM:BOM };
})();
