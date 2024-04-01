import "./swich.css";

export default function DarkSwich({ darkmode }) {
  return (
    <label className="switch">
      <div className="round">
        <input name="onoff" id="onoff" type="checkbox" onChange={darkmode} />
        <div className="back">
          <label for="onoff" className="but">
            <span className="on">0</span>
            <span className="off">I</span>
          </label>
        </div>
      </div>
    </label>
  );
}
