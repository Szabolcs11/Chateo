import React, { Fragment } from "react";
import group1 from "../assets/images/group1.png";
import group2 from "../assets/images/group2.png";
import group3 from "../assets/images/group3.png";
import person1 from "../assets/images/person1.png";
import person2 from "../assets/images/person2.png";
import person3 from "../assets/images/person3.png";
import person4 from "../assets/images/person4.png";
import person5 from "../assets/images/person5.png";
import TabComponent from "./TabComponent";

const groups = [
  {
    name: "Friend Forever",
    avatar: group1,
    lastmessage: "HaHaHaHa!",
    date: "Today, 9.52pm",
    notification: 3,
  },
  {
    name: "Friend Forever",
    avatar: group1,
    lastmessage: "HaHaHaHa!",
    date: "Today, 9.52pm",
    notification: false,
  },
  {
    name: "Friend Forever",
    avatar: group1,
    lastmessage: "HaHaHaHa!",
    date: "Today, 9.52pm",
    notification: 4,
  },
];

function GroupsComponent() {
  return (
    <div className="groups-main">
      <div className="groups-main-content">
        <div className="groups-title">Groups</div>

        <div className="groups-content">
          {groups.map((g, index) => {
            return (
              <Fragment key={`GROUP_TAB_${index}`}>
                {/* <TabComponent
                  // key={`GROUP_TAB_${index}`}
                  name={g.name}
                  date={g.date}
                  avatar={g.avatar}
                  lastmessage={g.lastmessage}
                  notification={g.notification}
                /> */}
                {/* {index < groups.length - 1 && (
                  <div
                    // key={`GROUP_TAB_DEVIDER${index}`}
                    className="tab-devider"
                  ></div>
                )} */}
              </Fragment>
            );
          })}
          {/* <TabComponent name={'Friend Forever'} date={'Today, 9.52'} avatar={group1} lastmessage={'HaHaHaHa!'} notification={'3'}  /> */}
          {/* <div className='tab'>
                    
                    <div className='tab-left'>
                    <img alt='NoImgFound' src={group1} className='group-icon' style={{width: '50px', height: '50px', borderRadius: '50%'}} />
                    <div className='tab-datas'>
                        <div className='tab-datas-name'>Friends Forever</div>
                        <div className='tab-datas-lastmessage'>Hahahahah!</div>
                    </div>
                    </div>
                    <div className='tab-datasandnotifications'>
                    <div className='tab-date'>Today, 9.52pm</div>
                    <div className='tab-notification'>
                        <div className='tab-newmessage'>
                        3
                        </div>
                    </div>
                    </div>
                </div>
                <div className='tab-devider'></div>

                <TabComponent name={'Friend Forever'} date={'Today, 9.52'} avatar={group1} lastmessage={'HaHaHaHa!'} notification={'3'}  />
                <div className='tab-devider'></div>

                <div className='tab'>   
                    <div className='tab-left'>
                        <img alt='NoImgFound' src={group2} className='group-icon' style={{width: '50px', height: '50px', borderRadius: '50%'}} />
                        <div className='tab-datas'>
                            <div className='tab-datas-name'>Mera Gang</div>
                            <div className='tab-datas-lastmessage'>Kyuuuuu???</div>
                        </div>
                    </div>
                    <div className='tab-datasandnotifications'>
                    <div className='tab-date'>Yesterday, 12.31pm</div>
                    </div>
                </div>
                <div className='tab-devider'></div>
                <div className='tab'>
                    
                    <div className='tab-left'>
                        <img alt='NoImgFound' src={group3} className='group-icon' style={{width: '50px', height: '50px', borderRadius: '50%'}} />
                        <div className='tab-datas'>
                            <div className='tab-datas-name'>Hiking</div>
                            <div className='tab-datas-lastmessage'>It`s not going to happen</div>
                        </div>
                    </div>
                    <div className='tab-datasandnotifications'>
                        <div className='tab-date'>Today, 9.52pm</div>
                    </div>
                </div>
                <div className='tab-devider'></div>
                <div className='tab'>
                    
                    <div className='tab-left'>
                    <img alt='NoImgFound' src={group1} className='group-icon' style={{width: '50px', height: '50px', borderRadius: '50%'}} />
                    <div className='tab-datas'>
                        <div className='tab-datas-name'>Friends Forever</div>
                        <div className='tab-datas-lastmessage'>Hahahahah!</div>
                    </div>
                    </div>
                    <div className='tab-datasandnotifications'>
                    <div className='tab-date'>Today, 9.52pm</div>
                    <div className='tab-notification'>
                        <div className='tab-newmessage'>
                        4
                        </div>
                    </div>
                    </div>
                </div> */}
        </div>
      </div>
    </div>
  );
}

export default GroupsComponent;
