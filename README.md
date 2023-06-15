# Benchmarks
POST /upload
~6.0s

oha -z 10s http://localhost:8000/html

Summary:
  Success rate: 100.00%
  Total:        10.0007 secs
  Slowest:      0.0838 secs
  Fastest:      0.0055 secs
  Average:      0.0069 secs
  Requests/sec: 7264.0586

  Total data:   31.25 MiB
  Size/request: 451 B
  Size/sec:     3.12 MiB

oha -z 10s http://localhost:8000/upload

Summary:
  Success rate: 100.00%
  Total:        10.0002 secs
  Slowest:      0.0229 secs
  Fastest:      0.0024 secs
  Average:      0.0086 secs
  Requests/sec: 5841.1822

  Total data:   121.39 MiB
  Size/request: 2.13 KiB
  Size/sec:     12.14 MiB

oha -z 10s http://localhost:8000/index.html

Summary:
  Success rate: 100.00%
  Total:        10.0010 secs
  Slowest:      0.0462 secs
  Fastest:      0.0169 secs
  Average:      0.0205 secs
  Requests/sec: 2439.8453