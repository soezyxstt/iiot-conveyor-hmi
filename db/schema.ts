// src/db/schema.ts
import { 
  pgTable, 
  serial, 
  boolean, 
  real, 
  timestamp, 
  pgEnum,
  index 
} from "drizzle-orm/pg-core";

// Enums for non-binary states to ensure data integrity
export const pointStateEnum = pgEnum("point_state", ["empty", "occupied", "occupied_metallic"]);
export const motorIdEnum = pgEnum("motor_identifier", ["stepper_1", "stepper_2"]);

// ----------------------------------------------------------------------
// TABLE 1: HIGH FREQUENCY TELEMETRY
// Stores the snapshot of the machine state. 
// Optimized for heavy writes and time-range reads.
// ----------------------------------------------------------------------
export const machineLogs = pgTable("machine_logs", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // Linear Actuators (Relay States)
  la1Forward: boolean("la1_forward").notNull(),
  la1Backward: boolean("la1_backward").notNull(),
  la2Forward: boolean("la2_forward").notNull(),
  la2Backward: boolean("la2_backward").notNull(),

  // Stepper Motor Control (Relay States)
  stepper1Relay: boolean("stepper1_relay").notNull(),
  stepper2Relay: boolean("stepper2_relay").notNull(),

  // Proximity Sensor Relays (Active/Inactive)
  irRelay: boolean("ir_relay").notNull(),
  inductiveRelay: boolean("inductive_relay").notNull(),
  capacitiveRelay: boolean("capacitive_relay").notNull(),

  // Sensor Inputs (Detected/Not Detected)
  irSensor: boolean("ir_sensor").notNull(),
  inductiveSensor: boolean("inductive_sensor").notNull(),
  capacitiveSensor: boolean("capacitive_sensor").notNull(),

  // Stepper Feedback (Numeric)
  // Using 'real' (float4) to map PLC floating point values for RPM/Angle
  stepper1Rpm: real("stepper1_rpm").notNull(),
  stepper1Position: real("stepper1_pos").notNull(), 
  stepper2Rpm: real("stepper2_rpm").notNull(),
  stepper2Position: real("stepper2_pos").notNull(),

  // System Health
  isPowerLive: boolean("is_power_live").notNull(),

  // Outer Points (Complex State)
  outerPoint1: pointStateEnum("outer_point_1").notNull(),
  outerPoint2: pointStateEnum("outer_point_2").notNull(),
  outerPoint3: pointStateEnum("outer_point_3").notNull(),
  outerPoint4: pointStateEnum("outer_point_4").notNull(),
  outerPoint5: pointStateEnum("outer_point_5").notNull(),

  // Inner Points (Binary State: Empty/Occupied)
  innerPoint1Occupied: boolean("inner_point_1_occupied").notNull(),
  innerPoint2Occupied: boolean("inner_point_2_occupied").notNull(),
  innerPoint3Occupied: boolean("inner_point_3_occupied").notNull(),
  innerPoint4Occupied: boolean("inner_point_4_occupied").notNull(),
  innerPoint5Occupied: boolean("inner_point_5_occupied").notNull(),

}, (table) => {
  return {
    // BRIN or B-Tree index essential for time-series range queries
    createdAtIndex: index("created_at_idx").on(table.createdAt),
  };
});

// ----------------------------------------------------------------------
// TABLE 2: DRIFT CALIBRATION LOGS
// Event-driven table. Only populated when a prox switch reset occurs.
// ----------------------------------------------------------------------
export const stepperDriftLogs = pgTable("stepper_drift_logs", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  motorId: motorIdEnum("motor_id").notNull(),
  
  // The theoretical position the PLC calculated before physical reset
  commandedPosition: real("commanded_position").notNull(),
  
  // The delta (commanded - actual/zero)
  driftValue: real("drift_value").notNull(),

}, (table) => {
  return {
    // Composite index might be useful here if querying drift by motor over time often
    motorTimeIdx: index("motor_time_idx").on(table.motorId, table.createdAt),
  };
});