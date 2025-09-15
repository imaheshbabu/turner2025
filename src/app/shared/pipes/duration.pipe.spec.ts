import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should format seconds correctly', () => {
      expect(pipe.transform(30)).toBe('0:30');
      expect(pipe.transform(90)).toBe('1:30');
      expect(pipe.transform(150)).toBe('2:30');
    });

    it('should format minutes correctly', () => {
      expect(pipe.transform(60)).toBe('1:00');
      expect(pipe.transform(120)).toBe('2:00');
      expect(pipe.transform(600)).toBe('10:00');
    });

    it('should format hours correctly', () => {
      expect(pipe.transform(3600)).toBe('1:00:00');
      expect(pipe.transform(3661)).toBe('1:01:01');
      expect(pipe.transform(7200)).toBe('2:00:00');
      expect(pipe.transform(7323)).toBe('2:02:03');
    });

    it('should handle edge cases', () => {
      expect(pipe.transform(0)).toBe('0:00');
      expect(pipe.transform(-10)).toBe('0:00');
      expect(pipe.transform(null as unknown as number)).toBe('0:00');
      expect(pipe.transform(undefined as unknown as number)).toBe('0:00');
    });

    it('should pad single digits with zeros', () => {
      expect(pipe.transform(65)).toBe('1:05');
      expect(pipe.transform(3605)).toBe('1:00:05');
      expect(pipe.transform(3665)).toBe('1:01:05');
    });

    it('should handle large durations', () => {
      expect(pipe.transform(36000)).toBe('10:00:00');
      expect(pipe.transform(359999)).toBe('99:59:59');
    });
  });
});
