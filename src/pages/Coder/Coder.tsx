import React from "react";

import "./Coder.css";
import CodeEditor from "../../components/CodeEditor";

const Coder: React.FC = () => {
  return (
    <div className="coder-container">
      <div className="coder-breadcrumb">Bài tập &gt; Coder</div>
      <CodeEditor
        defaultCode={`print("Kết nối tương lai chào bạn, ", input())`}
        defaultInput="LongBanhBao"
      />
    </div>
  );
};

export default Coder;
