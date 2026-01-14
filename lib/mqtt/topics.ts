const PREFIX = 'ITB/IIOT';

export const MQTT_TOPICS = {
  // --- SENSORS (ITB/IIOT/conveyor/sensor/...) ---
  // Boolean Sensors
  IR_SENSOR_STATE: `${PREFIX}/conveyor/sensor/ir/state`,
  INDUCTIVE_SENSOR_STATE: `${PREFIX}/conveyor/sensor/inductive/state`,
  CAPACITIVE_SENSOR_STATE: `${PREFIX}/conveyor/sensor/capacitive/state`,
  POSITION_INNER_SENSOR: `${PREFIX}/conveyor/sensor/position_inner/state`,
  POSITION_OUTER_SENSOR: `${PREFIX}/conveyor/sensor/position_outer/state`,
  OBJECT_INNER_COUNT: `${PREFIX}/conveyor/sensor/object_inner/state`,
  OBJECT_OUTER_COUNT: `${PREFIX}/conveyor/sensor/object_outer/state`,

  // Data Sensors
  // Note: Motor Speed sensor might be deprecated in favor of boolean Stepper state, 
  // but keeping it if legacy or needed.
  MOTOR_SPEED_SENSOR: `${PREFIX}/conveyor/sensor/motor_speed/state`,
  
  // --- ACTUATOR (ITB/IIOT/conveyor/actuator/...) ---
  // Updated per user request (Removed 'feedback' path)
  ACTUATOR_DL_PUSH: `${PREFIX}/conveyor/actuator/DL/push`,
  ACTUATOR_DL_PULL: `${PREFIX}/conveyor/actuator/DL/pull`,
  ACTUATOR_LD_PUSH: `${PREFIX}/conveyor/actuator/LD/push`,
  ACTUATOR_LD_PULL: `${PREFIX}/conveyor/actuator/LD/pull`,
  
  // Steppers
  STEPPER_INNER: `${PREFIX}/conveyor/actuator/stepper/inner`,
  STEPPER_OUTER: `${PREFIX}/conveyor/actuator/stepper/outer`,
  
  // --- SYSTEM STATUS ---
  MQTT_STATUS: `${PREFIX}/conveyor/mqtt_status`,

  // --- LEGACY / UNCONFIRMED ---
  POWER_ELECTRICITY: `${PREFIX}/conveyor/power/electricity/status`,
  SYSTEM_MODE: `${PREFIX}/conveyor/system/mode`,
  SYSTEM_SPEED: `${PREFIX}/conveyor/system/speed`,
  
  // Placing Points
  OUTER_POINT: (point_id: number) => `${PREFIX}/conveyor/outer/point/${point_id}/state`,
  INNER_POINT: (point_id: number) => `${PREFIX}/conveyor/inner/point/${point_id}/state`,

  // Web Control Topics (If distinct, otherwise use above)
  // Current assumption: Control via these topics (or mapped elsewhere)
  // Keeping these as legacy placeholders or for specific web-only messages if needed.
  WEB_CONTROL_DL_PUSH: 'from_web/conveyor/actuator/DL/push',
  WEB_CONTROL_DL_PULL: 'from_web/conveyor/actuator/DL/pull',
  WEB_CONTROL_LD_PUSH: 'from_web/conveyor/actuator/LD/push',
  WEB_CONTROL_LD_PULL: 'from_web/conveyor/actuator/LD/pull',
} as const;

// All topics for subscription
export const SUBSCRIBE_TOPICS: string[] = [
  MQTT_TOPICS.IR_SENSOR_STATE,
  MQTT_TOPICS.INDUCTIVE_SENSOR_STATE,
  MQTT_TOPICS.CAPACITIVE_SENSOR_STATE,
  MQTT_TOPICS.POSITION_INNER_SENSOR,
  MQTT_TOPICS.POSITION_OUTER_SENSOR,
  MQTT_TOPICS.MOTOR_SPEED_SENSOR,
  MQTT_TOPICS.OBJECT_INNER_COUNT,
  MQTT_TOPICS.OBJECT_OUTER_COUNT,

  MQTT_TOPICS.ACTUATOR_DL_PUSH,
  MQTT_TOPICS.ACTUATOR_DL_PULL,
  MQTT_TOPICS.ACTUATOR_LD_PUSH,
  MQTT_TOPICS.ACTUATOR_LD_PULL,
  MQTT_TOPICS.STEPPER_INNER,
  MQTT_TOPICS.STEPPER_OUTER,
  
  MQTT_TOPICS.MQTT_STATUS,
  
  MQTT_TOPICS.POWER_ELECTRICITY,
  MQTT_TOPICS.SYSTEM_MODE,
  MQTT_TOPICS.SYSTEM_SPEED,
  ...Array.from({ length: 10 }, (_, i) => MQTT_TOPICS.OUTER_POINT(i + 1)),
  ...Array.from({ length: 10 }, (_, i) => MQTT_TOPICS.INNER_POINT(i + 1)),
];

