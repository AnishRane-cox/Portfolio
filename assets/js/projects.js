window.PROJECTS = [
  {
    "id": "madrl-llm",
    "title": "LLM-Enhanced Multi-Agent RL for Autonomous Driving",
    "year": "MSc Dissertation · 2026",
    "cats": [
      "Research",
      "Reinforcement Learning",
      "LLM / RAG"
    ],
    "icon": "🚗",
    "metric": "−65.6% collisions",
    "summary": "An LLM assigns driving roles offline during training, conditioning decentralised multi-agent policies with no runtime LLM latency.",
    "problem": "Autonomous vehicles must coordinate with other agents in dense, changing traffic. Calling an LLM at runtime adds latency that safety-critical driving cannot afford.",
    "approach": [
      "An LLM assigns semantic driving roles (yield, merge, block, proceed) only during training, fused into a latent role embedding that conditions a decentralised multi-agent policy.",
      "Architecture: centralised-training / decentralised-execution multi-agent RL, inter-agent attention and an analytical safety shield.",
      "Benchmarked 9 configurations (rule-based controller, standard RL baseline, proposed framework, 6 ablations) across 8 simulated scenarios with shifts in density, weather, incidents and topology.",
      "Results reproduced across 6 independently seeded reruns."
    ],
    "result": "Fleet speed up 11.6% and collision rate down 65.6% versus a standard RL baseline. Ablations showed the safety shield, not the LLM alone, was the dominant contributor to the safety gain.",
    "tags": [
      "Multi-agent RL",
      "LLMs",
      "CTDE",
      "Attention",
      "Safety shield",
      "Python"
    ],
    "repo": "",
    "note": "Dissertation code not public yet. Details available on request."
  },
  {
    "id": "rag-engine",
    "title": "Production RAG Search for Engine Spec Matching",
    "year": "2023 – Present",
    "cats": [
      "LLM / RAG",
      "Industrial AI"
    ],
    "icon": "🔎",
    "metric": "+60% match accuracy",
    "summary": "Semantic search that matches technical engine specifications to customer requirements.",
    "problem": "Sales and engineering teams spent time manually matching customer requirements against dense technical specifications, slowing every handoff.",
    "approach": [
      "Architected a production RAG search engine with Qwen2 0.5B and ChromaDB semantic retrieval.",
      "Indexed technical engine specifications for semantic matching against customer requirements."
    ],
    "result": "Match accuracy up 60% and a shorter sales-to-engineering handoff.",
    "tags": [
      "Qwen2",
      "ChromaDB",
      "RAG",
      "Python"
    ],
    "repo": "",
    "note": "Built at Weichai Power, so the code is proprietary. Happy to discuss the design in an interview."
  },
  {
    "id": "predictive-maint",
    "title": "LSTM Predictive Maintenance & Anomaly Detection",
    "year": "2023 – Present",
    "cats": [
      "Industrial AI",
      "Deep Learning"
    ],
    "icon": "🛠️",
    "metric": "~20% less downtime",
    "summary": "Real-time anomaly detection across 25 industrial sensors and hydraulic subsystems.",
    "problem": "Unplanned downtime on industrial equipment is costly, and failures often show up in sensor data before they become breakdowns.",
    "approach": [
      "Built LSTM models on time-series data from 25 industrial sensors and hydraulic subsystems.",
      "Added real-time anomaly detection to flag abnormal behaviour early."
    ],
    "result": "Unplanned downtime reduced by about 20%.",
    "tags": [
      "LSTM",
      "Time series",
      "Anomaly detection",
      "Python"
    ],
    "repo": "",
    "note": "Built at Weichai Power, so the code is proprietary. Happy to discuss the design in an interview."
  },
  {
    "id": "insurance-rag",
    "title": "Life Insurance Policy Chatbot (RAG)",
    "year": "2025",
    "cats": [
      "LLM / RAG",
      "NLP"
    ],
    "icon": "📄",
    "summary": "Grounded Q&A over 1,000+ policy documents with dual-stage retrieval and a citation-accuracy evaluation framework.",
    "problem": "Insurance policies are full of jargon, dense tables and scattered clauses. Customers cannot easily answer questions like “Can I surrender this policy?” or “How is a claim processed?”.",
    "approach": [
      "Extracted text and tables from policy PDFs with pdfplumber; chunked into 500-token segments with 50-token overlap.",
      "Stored OpenAI ada-002 embeddings in ChromaDB.",
      "Dual-stage retrieval: vector similarity, then a CrossEncoder (MiniLM) re-ranker.",
      "GPT-3.5 Turbo with prompts that keep answers grounded, orchestrated with LangChain.",
      "Built a citation-accuracy evaluation framework to measure grounding."
    ],
    "result": "92% accuracy across 1,000+ documents with sub-2-second query response.",
    "tags": [
      "Python",
      "LangChain",
      "ChromaDB",
      "GPT-3.5",
      "CrossEncoder"
    ],
    "repo": "https://github.com/AnishRane-cox/Insurance-HelpMateAI",
    "metric": "92% accuracy",
    "note": ""
  },
  {
    "id": "skin-cancer",
    "title": "Skin Cancer Detection with CNN",
    "year": "",
    "cats": [
      "Computer Vision",
      "Deep Learning"
    ],
    "icon": "🩺",
    "metric": "92% test accuracy",
    "summary": "TensorFlow/Keras CNN classifying 7 skin-cancer subtypes at 92% test accuracy.",
    "problem": "Early, accurate distinction between skin-cancer subtypes matters most, and is hard at scale.",
    "approach": [
      "Built a CNN pipeline in TensorFlow and Keras.",
      "Applied rotation and scaling augmentation to enrich training data.",
      "Added dropout layers to reduce overfitting."
    ],
    "result": "92% test accuracy across 7 skin-cancer subtypes, showing how AI can support early diagnosis.",
    "tags": [
      "TensorFlow",
      "Keras",
      "CNN",
      "Data augmentation"
    ],
    "repo": "https://github.com/AnishRane-cox/Skin-Cancer-Detection-using-CNN",
    "note": ""
  },
  {
    "id": "fake-news",
    "title": "Semantic Fake News Detection",
    "year": "2023",
    "cats": [
      "NLP",
      "Machine Learning"
    ],
    "icon": "📰",
    "metric": "91% acc · 0.906 F1",
    "summary": "Word2Vec + logistic regression pipeline reaching 91% accuracy and 0.906 F1.",
    "problem": "Misinformation spreads fast. Can the meaning of words, not just keywords, help a model separate fact from fiction?",
    "approach": [
      "Preprocessed text with lemmatisation and POS tagging.",
      "Generated semantic embeddings with Word2Vec.",
      "Compared Logistic Regression, Random Forest and Decision Tree classifiers."
    ],
    "result": "The logistic regression pipeline reached 91% accuracy and 0.906 F1, showing that simple, semantic-rich models can be effective.",
    "tags": [
      "Python",
      "Word2Vec",
      "Scikit-learn",
      "NLTK"
    ],
    "repo": "https://github.com/AnishRane-cox/Semantic-Fake-News-Detector",
    "note": ""
  },
  {
    "id": "gesture",
    "title": "Gesture Recognition with 3D-CNN",
    "year": "2023",
    "cats": [
      "Computer Vision",
      "Deep Learning"
    ],
    "icon": "✋",
    "metric": "78% val. accuracy",
    "summary": "Conv3D + ConvLSTM spatiotemporal model for video gesture classification.",
    "problem": "Human-computer interaction is moving beyond keyboards. Machines need to recognise gestures in video.",
    "approach": [
      "Designed Conv3D and ConvLSTM spatiotemporal architectures.",
      "Tuned learning rate and batch size.",
      "Stabilised training with L2 regularisation."
    ],
    "result": "78% validation accuracy on 15K video samples, plus a 30% training-time reduction through tuning and augmentation.",
    "tags": [
      "TensorFlow",
      "Conv3D",
      "ConvLSTM",
      "Video"
    ],
    "repo": "https://github.com/AnishRane-cox/Gesture-Recognition-using-3D-CNN",
    "note": ""
  },
  {
    "id": "bike",
    "title": "Bike Demand Prediction",
    "year": "2023",
    "cats": [
      "Machine Learning"
    ],
    "icon": "🚲",
    "metric": "R² = 0.82",
    "summary": "Multiple linear regression forecasting rental demand, with VIF-based feature pruning.",
    "problem": "A rental company must predict tomorrow's demand: overstocking wastes money, understocking loses revenue.",
    "approach": [
      "Combined weather, seasonal and user data.",
      "Fit a Multiple Linear Regression model with Scikit-learn.",
      "Removed multicollinearity using VIF-based feature pruning and scaling."
    ],
    "result": "R² of 0.82, strong enough to make automated inventory planning feasible.",
    "tags": [
      "Python",
      "Scikit-learn",
      "Regression",
      "Statsmodels"
    ],
    "repo": "https://github.com/AnishRane-cox/Bike-Demand-Prediction-MLR",
    "note": ""
  },
  {
    "id": "filter-sim",
    "title": "Cylindrical Filter Simulator",
    "year": "",
    "cats": [
      "Engineering + AI",
      "Tools"
    ],
    "icon": "🌬️",
    "summary": "Multi-physics simulator for air-filtration design with optimisation, reports and a Colab UI.",
    "problem": "Industrial filter design is still largely trial and error. It needs a simulation tool grounded in physics.",
    "approach": [
      "Modelled airflow, pressure drop, dust loading and efficiency in Python.",
      "Added geometry optimisation and a real-world filter-media database.",
      "Exported publication-ready Matplotlib plots, ReportLab PDF reports and JSON/CSV datasets."
    ],
    "result": "A research-grade tool with a Google Colab interface that lets engineers explore designs without a physical prototype.",
    "tags": [
      "Python",
      "Matplotlib",
      "ReportLab",
      "Simulation"
    ],
    "repo": "https://github.com/AnishRane-cox/Cylindrical-Filter-Simulator",
    "note": ""
  },
  {
    "id": "travel",
    "title": "Travel Experience Chatbot",
    "year": "In progress",
    "cats": [
      "LLM / RAG",
      "Tools"
    ],
    "icon": "✈️",
    "summary": "Flask chatbot combining GPT with flight and weather APIs for personalised itineraries.",
    "problem": "Planning a trip means juggling flights, hotels, weather and itineraries across many apps.",
    "approach": [
      "Built a Flask-based chatbot backend.",
      "Integrated OpenAI GPT, the Amadeus API and weather APIs.",
      "Used prompt engineering for personalised, real-time itineraries."
    ],
    "result": "A single interface for customised travel plans. Still being refined.",
    "tags": [
      "Flask",
      "OpenAI",
      "REST APIs",
      "Prompt engineering"
    ],
    "repo": "",
    "note": ""
  }
];
