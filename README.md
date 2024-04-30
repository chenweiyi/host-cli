# 一个使用cli命令来管理hosts的小工具

## 使用方法

添加一个host

> 使用add命令时，会自动添加一条 127.0.0.1 localhost

```
sudo npx easy-host-cli add 127.0.0.1 test
```

删除一个host

```
sudo npx easy-host-cli rm 127.0.0.1 test
```

删除一个ip下的所有host

```
sudo npx easy-host-cli rm 127.0.0.1
```
