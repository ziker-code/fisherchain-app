import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, CheckCircle2 } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export default function StatusSteps({ steps, currentStepIndex = 1, layout = 'vertical' }) {
  if (layout === 'horizontal') {
    return (
      <View style={styles.horizontalContainer}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          
          return (
            <React.Fragment key={idx}>
              {/* Step Circle */}
              <View style={styles.horizontalStep}>
                <View style={[
                  styles.circle,
                  isCompleted && styles.completedCircle,
                  isActive && styles.activeCircle,
                ]}>
                  {isCompleted ? (
                    <Check size={14} color="#FFF" />
                  ) : (
                    <View style={[styles.innerCircle, isActive && styles.activeInnerCircle]} />
                  )}
                </View>
                <Text style={[
                  styles.horizontalLabel,
                  isActive && styles.activeLabel,
                  isCompleted && styles.completedLabel
                ]}>
                  {step.title}
                </Text>
              </View>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <View style={[
                  styles.horizontalLine,
                  idx < currentStepIndex && styles.completedLine
                ]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  }

  // Vertical layout for Traceability Card
  return (
    <View style={styles.verticalContainer}>
      {steps.map((step, idx) => {
        const isCompleted = idx <= currentStepIndex;
        
        return (
          <View style={styles.verticalStepRow} key={idx}>
            {/* Left timeline line and icon */}
            <View style={styles.timelineLeft}>
              <View style={[
                styles.verticalCircle,
                isCompleted ? styles.verticalCompletedCircle : styles.verticalPendingCircle
              ]}>
                {step.icon ? step.icon(isCompleted ? COLORS.white : COLORS.textSecondary) : null}
              </View>
              {idx < steps.length - 1 && (
                <View style={[
                  styles.verticalLine,
                  idx < currentStepIndex && styles.verticalCompletedLine
                ]} />
              )}
            </View>

            {/* Right content */}
            <View style={styles.verticalContent}>
              <View style={styles.verticalHeaderRow}>
                <Text style={[
                  styles.verticalTitle,
                  isCompleted ? styles.verticalTitleActive : styles.verticalTitlePending
                ]}>
                  {step.title}
                </Text>
                {isCompleted && (
                  <CheckCircle2 size={16} color={COLORS.accent} fill={COLORS.primary} style={styles.checkIcon} />
                )}
              </View>
              <Text style={styles.verticalDescription}>{step.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Horizontal Styles
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  horizontalStep: {
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  activeCircle: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  activeInnerCircle: {
    backgroundColor: COLORS.primary,
  },
  horizontalLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  completedLabel: {
    color: COLORS.textPrimary,
  },
  horizontalLine: {
    height: 2,
    backgroundColor: '#E5E7EB',
    flex: 0.8,
    marginTop: -16,
  },
  completedLine: {
    backgroundColor: COLORS.success,
  },

  // Vertical Styles
  verticalContainer: {
    paddingLeft: 4,
  },
  verticalStepRow: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  verticalCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalCompletedCircle: {
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  verticalPendingCircle: {
    backgroundColor: '#374151',
    borderWidth: 1.5,
    borderColor: '#4B5563',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#374151',
    marginVertical: 4,
  },
  verticalCompletedLine: {
    backgroundColor: COLORS.accent,
  },
  verticalContent: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 16,
  },
  verticalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  verticalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  verticalTitleActive: {
    color: COLORS.white,
  },
  verticalTitlePending: {
    color: COLORS.textSecondary,
  },
  checkIcon: {
    marginLeft: 8,
  },
  verticalDescription: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 18,
  },
});
